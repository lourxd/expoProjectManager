import Foundation
import AppKit
import React

@objc(PackageModalManager)
class PackageModalManager: NSObject, NSWindowDelegate {

  private var modalWindow: NSWindow?

  @objc
  func showPackagesModal(_ dependencies: String,
                        devDependencies: String,
                        resolver resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {

    DispatchQueue.main.async { [weak self] in
      guard let self = self else {
        reject("MODAL_ERROR", "Modal manager instance lost", nil)
        return
      }

      // Parse dependencies
      var depsDict: [String: String] = [:]
      var devDepsDict: [String: String] = [:]

      if let depsData = dependencies.data(using: .utf8),
         let deps = try? JSONSerialization.jsonObject(with: depsData) as? [String: String] {
        depsDict = deps
      }

      if let devDepsData = devDependencies.data(using: .utf8),
         let devDeps = try? JSONSerialization.jsonObject(with: devDepsData) as? [String: String] {
        devDepsDict = devDeps
      }

      // Create modal window
      let window = self.createPackagesWindow(dependencies: depsDict, devDependencies: devDepsDict)

      // Get the main window
      if let mainWindow = NSApp.keyWindow {
        mainWindow.beginSheet(window) { response in
          resolve(true)
        }
      } else {
        // Fallback: show as regular window
        window.makeKeyAndOrderFront(nil)
        window.center()
        resolve(true)
      }

      self.modalWindow = window
    }
  }

  @objc
  func closeModal(_ resolve: @escaping RCTPromiseResolveBlock,
                  rejecter reject: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async { [weak self] in
      guard let self = self, let window = self.modalWindow else {
        resolve(false)
        return
      }

      if let sheetParent = window.sheetParent {
        sheetParent.endSheet(window)
      } else {
        window.close()
      }

      self.modalWindow = nil
      resolve(true)
    }
  }

  private func createPackagesWindow(dependencies: [String: String], devDependencies: [String: String]) -> NSWindow {
    let window = NSWindow(
      contentRect: NSRect(x: 0, y: 0, width: 700, height: 600),
      styleMask: [.titled, .closable, .resizable],
      backing: .buffered,
      defer: false
    )

    window.title = "All Packages"
    window.isReleasedWhenClosed = false
    window.backgroundColor = NSColor(red: 0.11, green: 0.11, blue: 0.12, alpha: 1.0) // Dark background

    // Set delegate to handle close
    window.delegate = self

    // Create content view
    let contentView = NSView(frame: window.contentView!.bounds)
    contentView.autoresizingMask = [.width, .height]

    // Create close button
    let closeButton = NSButton(frame: NSRect(x: contentView.bounds.width - 50, y: contentView.bounds.height - 50, width: 32, height: 32))
    closeButton.bezelStyle = .circular
    closeButton.title = ""
    closeButton.image = NSImage(systemSymbolName: "xmark", accessibilityDescription: "Close")
    closeButton.contentTintColor = .white
    closeButton.isBordered = true
    closeButton.wantsLayer = true
    closeButton.layer?.backgroundColor = NSColor(red: 0.15, green: 0.15, blue: 0.16, alpha: 1.0).cgColor
    closeButton.layer?.cornerRadius = 16
    closeButton.target = self
    closeButton.action = #selector(closeButtonClicked)
    closeButton.autoresizingMask = [.minXMargin, .minYMargin]
    contentView.addSubview(closeButton)

    // Create scroll view (adjusted to not overlap close button)
    let scrollView = NSScrollView(frame: NSRect(x: 0, y: 0, width: contentView.bounds.width, height: contentView.bounds.height - 60))
    scrollView.autoresizingMask = [.width, .height]
    scrollView.hasVerticalScroller = true
    scrollView.borderType = .noBorder
    scrollView.backgroundColor = .clear

    // Create document view with flipped coordinates
    let documentView = FlippedView(frame: NSRect(x: 0, y: 0, width: scrollView.contentSize.width, height: 800))

    var yOffset: CGFloat = 20

    // Dependencies section
    if !dependencies.isEmpty {
      let depsLabel = createSectionLabel(text: "Dependencies (\(dependencies.count))")
      depsLabel.frame.origin = NSPoint(x: 20, y: yOffset)
      documentView.addSubview(depsLabel)
      yOffset += depsLabel.frame.height + 12

      let depsView = createPackagesList(packages: dependencies, isDev: false, width: scrollView.contentSize.width - 40)
      depsView.frame.origin = NSPoint(x: 20, y: yOffset)
      documentView.addSubview(depsView)
      yOffset += depsView.frame.height + 24
    }

    // Dev Dependencies section
    if !devDependencies.isEmpty {
      let devDepsLabel = createSectionLabel(text: "Dev Dependencies (\(devDependencies.count))")
      devDepsLabel.frame.origin = NSPoint(x: 20, y: yOffset)
      documentView.addSubview(devDepsLabel)
      yOffset += devDepsLabel.frame.height + 12

      let devDepsView = createPackagesList(packages: devDependencies, isDev: true, width: scrollView.contentSize.width - 40)
      devDepsView.frame.origin = NSPoint(x: 20, y: yOffset)
      documentView.addSubview(devDepsView)
      yOffset += devDepsView.frame.height + 24
    }

    // Adjust document view height
    documentView.frame.size.height = yOffset + 20

    scrollView.documentView = documentView
    contentView.addSubview(scrollView)
    window.contentView = contentView

    return window
  }

  private func createSectionLabel(text: String) -> NSTextField {
    let label = NSTextField(labelWithString: text)
    label.font = NSFont.systemFont(ofSize: 14, weight: .bold)
    label.textColor = NSColor.white
    label.frame.size = NSSize(width: 400, height: 20)
    return label
  }

  private func createPackagesList(packages: [String: String], isDev: Bool, width: CGFloat) -> NSView {
    let container = NSView(frame: NSRect(x: 0, y: 0, width: width, height: 0))

    var yOffset: CGFloat = 0
    let sortedPackages = packages.sorted { $0.key < $1.key }

    for (name, version) in sortedPackages {
      let packageView = createPackageRow(name: name, version: version, isDev: isDev, width: width)
      packageView.frame.origin = NSPoint(x: 0, y: yOffset)
      container.addSubview(packageView)
      yOffset += packageView.frame.height + 8
    }

    container.frame.size.height = yOffset > 0 ? yOffset - 8 : 0
    return container
  }

  private func createPackageRow(name: String, version: String, isDev: Bool, width: CGFloat) -> NSView {
    let button = PackageButton(frame: NSRect(x: 0, y: 0, width: width, height: 48))
    button.packageName = name
    button.wantsLayer = true
    button.layer?.backgroundColor = NSColor(red: 0.15, green: 0.15, blue: 0.16, alpha: 1.0).cgColor
    button.layer?.cornerRadius = 8
    button.layer?.borderWidth = 1
    button.layer?.borderColor = NSColor(red: 0.2, green: 0.2, blue: 0.22, alpha: 1.0).cgColor

    // Add hover effect
    let trackingArea = NSTrackingArea(
      rect: button.bounds,
      options: [.mouseEnteredAndExited, .activeInActiveApp, .inVisibleRect],
      owner: button,
      userInfo: nil
    )
    button.addTrackingArea(trackingArea)

    // Package icon
    let iconView = NSImageView(frame: NSRect(x: 12, y: 12, width: 24, height: 24))
    iconView.wantsLayer = true
    iconView.layer?.cornerRadius = 4
    iconView.imageScaling = .scaleProportionallyUpOrDown

    // Try to load package logo
    loadPackageLogo(for: name, into: iconView)

    button.addSubview(iconView)

    // Package name
    let nameLabel = NSTextField(labelWithString: name)
    nameLabel.font = NSFont.systemFont(ofSize: 13, weight: .semibold)
    nameLabel.textColor = NSColor.white
    nameLabel.frame = NSRect(x: 44, y: 14, width: width - 190, height: 20)
    nameLabel.isEditable = false
    nameLabel.isBordered = false
    nameLabel.backgroundColor = .clear
    button.addSubview(nameLabel)

    // Version badge
    let versionBadge = NSView(frame: NSRect(x: width - 120, y: 12, width: 108, height: 24))
    versionBadge.wantsLayer = true
    if isDev {
      versionBadge.layer?.backgroundColor = NSColor(red: 0.04, green: 0.52, blue: 1.0, alpha: 0.15).cgColor
      versionBadge.layer?.borderColor = NSColor(red: 0.04, green: 0.52, blue: 1.0, alpha: 0.3).cgColor
    } else {
      versionBadge.layer?.backgroundColor = NSColor(red: 0.18, green: 0.18, blue: 0.19, alpha: 1.0).cgColor
      versionBadge.layer?.borderColor = NSColor(red: 0.25, green: 0.25, blue: 0.27, alpha: 1.0).cgColor
    }
    versionBadge.layer?.cornerRadius = 6
    versionBadge.layer?.borderWidth = 1

    let versionLabel = NSTextField(labelWithString: version)
    versionLabel.font = NSFont.monospacedSystemFont(ofSize: 11, weight: .bold)
    versionLabel.textColor = NSColor.white
    versionLabel.alignment = .center
    versionLabel.frame = versionBadge.bounds
    versionLabel.isEditable = false
    versionLabel.isBordered = false
    versionLabel.backgroundColor = .clear
    versionBadge.addSubview(versionLabel)

    button.addSubview(versionBadge)

    return button
  }

  private func loadPackageLogo(for packageName: String, into imageView: NSImageView) {
    // Set default icon first
    if let defaultIcon = NSImage(systemSymbolName: "cube.fill", accessibilityDescription: nil) {
      defaultIcon.isTemplate = true
      imageView.image = defaultIcon
      imageView.contentTintColor = NSColor(red: 0.04, green: 0.52, blue: 1.0, alpha: 1.0)
    }

    // Try to load from unpkg CDN
    let possiblePaths = [
      "https://unpkg.com/\(packageName)/logo.png",
      "https://unpkg.com/\(packageName)/icon.png",
      "https://unpkg.com/\(packageName)/logo.svg",
    ]

    for urlString in possiblePaths {
      guard let url = URL(string: urlString) else { continue }

      URLSession.shared.dataTask(with: url) { [weak imageView] data, response, error in
        guard let data = data,
              let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200,
              let image = NSImage(data: data) else {
          return
        }

        DispatchQueue.main.async {
          imageView?.image = image
          imageView?.contentTintColor = nil
        }
      }.resume()

      // Only try first URL for now
      break
    }
  }

  // MARK: - Actions

  @objc private func closeButtonClicked() {
    if let window = modalWindow {
      if let sheetParent = window.sheetParent {
        sheetParent.endSheet(window)
      } else {
        window.close()
      }
      modalWindow = nil
    }
  }

  // MARK: - NSWindowDelegate

  func windowWillClose(_ notification: Notification) {
    if let window = notification.object as? NSWindow, window == modalWindow {
      modalWindow = nil
    }
  }

  func windowShouldClose(_ sender: NSWindow) -> Bool {
    if let sheetParent = sender.sheetParent {
      sheetParent.endSheet(sender)
    }
    return true
  }
}

// MARK: - FlippedView

class FlippedView: NSView {
  override var isFlipped: Bool {
    return true
  }
}

// MARK: - PackageButton

class PackageButton: NSView {
  var packageName: String = ""
  private var isHovered = false

  override func mouseEntered(with event: NSEvent) {
    isHovered = true
    layer?.backgroundColor = NSColor(red: 0.18, green: 0.18, blue: 0.19, alpha: 1.0).cgColor
    NSCursor.pointingHand.push()
  }

  override func mouseExited(with event: NSEvent) {
    isHovered = false
    layer?.backgroundColor = NSColor(red: 0.15, green: 0.15, blue: 0.16, alpha: 1.0).cgColor
    NSCursor.pop()
  }

  override func mouseDown(with event: NSEvent) {
    layer?.backgroundColor = NSColor(red: 0.2, green: 0.2, blue: 0.21, alpha: 1.0).cgColor
  }

  override func mouseUp(with event: NSEvent) {
    if isHovered {
      layer?.backgroundColor = NSColor(red: 0.18, green: 0.18, blue: 0.19, alpha: 1.0).cgColor
      openPackagePage()
    } else {
      layer?.backgroundColor = NSColor(red: 0.15, green: 0.15, blue: 0.16, alpha: 1.0).cgColor
    }
  }

  private func openPackagePage() {
    // Try to open npm package page
    let npmURL = "https://www.npmjs.com/package/\(packageName)"
    if let url = URL(string: npmURL) {
      NSWorkspace.shared.open(url)
    }
  }
}
