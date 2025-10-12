import Foundation
import React

@objc(ProjectScanner)
class ProjectScanner: RCTEventEmitter {

  private var hasListeners = false
  private var shouldCancelScan = false

  override init() {
    super.init()
  }

  override func supportedEvents() -> [String]! {
    return ["onScanProgress", "onProjectFound"]
  }

  override func startObserving() {
    hasListeners = true
  }

  override func stopObserving() {
    hasListeners = false
  }

  private func sendProgress(type: String, message: String, currentPath: String) {
    if hasListeners {
      sendEvent(withName: "onScanProgress", body: [
        "type": type,
        "message": message,
        "currentPath": currentPath
      ])
    }
  }

  private func sendProjectFound(projectData: [String: Any]) {
    if hasListeners {
      sendEvent(withName: "onProjectFound", body: projectData)
    }
  }

  @objc
  func cancelScan(_ resolve: @escaping RCTPromiseResolveBlock,
                  rejecter reject: @escaping RCTPromiseRejectBlock) {
    shouldCancelScan = true
    resolve(true)
  }

  @objc
  func scanFolder(_ folderPath: String,
                  resolver resolve: @escaping RCTPromiseResolveBlock,
                  rejecter reject: @escaping RCTPromiseRejectBlock) {

    DispatchQueue.global(qos: .userInitiated).async { [weak self] in
      guard let self = self else {
        reject("SCANNER_ERROR", "Scanner instance lost", nil)
        return
      }

      // Reset cancellation flag at start of scan
      self.shouldCancelScan = false

      let fileManager = FileManager.default
      let wasCancelled = self.scanDirectory(at: folderPath, fileManager: fileManager)

      DispatchQueue.main.async {
        resolve([
          "cancelled": wasCancelled,
          "completed": !wasCancelled
        ])
      }
    }
  }

  private func scanDirectory(at path: String, fileManager: FileManager) -> Bool {
    // Check for cancellation
    if shouldCancelScan {
      return true
    }

    guard let items = try? fileManager.contentsOfDirectory(atPath: path) else {
      return false
    }

    for item in items {
      // Check for cancellation
      if shouldCancelScan {
        return true
      }

      // Skip hidden folders and common non-project directories
      if item.hasPrefix(".") || ["node_modules", "build", "dist", ".git", "ios", "android"].contains(item) {
        continue
      }

      // Skip simulator and system directories
      let lowerItem = item.lowercased()
      if lowerItem.contains("simulator") ||
         lowerItem.contains(".app") ||
         lowerItem.hasSuffix(".xcodeproj") ||
         lowerItem.hasSuffix(".xcworkspace") ||
         item == "Library" ||
         item == "Pods" ||
         item == "DerivedData" {
        continue
      }

      let fullPath = (path as NSString).appendingPathComponent(item)

      var isDirectory: ObjCBool = false
      guard fileManager.fileExists(atPath: fullPath, isDirectory: &isDirectory), isDirectory.boolValue else {
        continue
      }

      sendProgress(type: "scanning", message: "Scanning...", currentPath: fullPath)

      // Check if this is an Expo project
      let packageJsonPath = (fullPath as NSString).appendingPathComponent("package.json")
      let appJsonPath = (fullPath as NSString).appendingPathComponent("app.json")

      if fileManager.fileExists(atPath: packageJsonPath) {
        // Read package.json to check for expo
        if let packageData = try? Data(contentsOf: URL(fileURLWithPath: packageJsonPath)),
           let packageJson = try? JSONSerialization.jsonObject(with: packageData) as? [String: Any],
           let dependencies = packageJson["dependencies"] as? [String: Any] {

          if dependencies["expo"] != nil || dependencies["@expo/vector-icons"] != nil {
            // This is an Expo project
            if fileManager.fileExists(atPath: appJsonPath) {
              // Check for cancellation before extracting project data (this can be slow)
              if shouldCancelScan {
                return true
              }

              let projectData = extractProjectData(
                fullPath: fullPath,
                packageJson: packageJson,
                appJsonPath: appJsonPath,
                fileManager: fileManager
              )
              // Emit project immediately instead of collecting
              sendProjectFound(projectData: projectData)
              sendProgress(type: "found", message: "Found Expo project", currentPath: fullPath)
            } else {
              sendProgress(type: "skipped", message: "No app.json found", currentPath: fullPath)
            }
            // Don't scan subdirectories of Expo projects
            continue
          } else {
            // It's another framework, skip its subdirectories
            sendProgress(type: "skipped", message: "Non-Expo project", currentPath: fullPath)
            continue
          }
        }
      }

      // Recursively scan subdirectories
      let wasCancelled = scanDirectory(at: fullPath, fileManager: fileManager)
      if wasCancelled {
        return true
      }
    }

    return false
  }

  private func extractProjectData(fullPath: String, packageJson: [String: Any], appJsonPath: String, fileManager: FileManager) -> [String: Any] {
    var projectData: [String: Any] = [:]

    // Basic info
    let folderName = (fullPath as NSString).lastPathComponent
    projectData["folderName"] = folderName
    projectData["path"] = fullPath

    // Get version from package.json
    if let version = packageJson["version"] as? String {
      projectData["version"] = version
    }

    // Get dependencies
    if let dependencies = packageJson["dependencies"] as? [String: Any] {
      if let jsonData = try? JSONSerialization.data(withJSONObject: dependencies),
         let jsonString = String(data: jsonData, encoding: .utf8) {
        projectData["dependencies"] = jsonString
      }
    }

    // Get devDependencies
    if let devDependencies = packageJson["devDependencies"] as? [String: Any] {
      if let jsonData = try? JSONSerialization.data(withJSONObject: devDependencies),
         let jsonString = String(data: jsonData, encoding: .utf8) {
        projectData["devDependencies"] = jsonString
      }
    }

    // Read app.json
    if let appData = try? Data(contentsOf: URL(fileURLWithPath: appJsonPath)),
       let appJson = try? JSONSerialization.jsonObject(with: appData) as? [String: Any] {

      // Try to get expo config (could be at root or under "expo" key)
      let expoConfig = (appJson["expo"] as? [String: Any]) ?? appJson

      if let name = expoConfig["name"] as? String {
        projectData["name"] = name
      }

      if let slug = expoConfig["slug"] as? String {
        projectData["slug"] = slug
      }

      if let scheme = expoConfig["scheme"] as? String {
        projectData["scheme"] = scheme
      }

      if let sdkVersion = expoConfig["sdkVersion"] as? String {
        projectData["sdkVersion"] = sdkVersion
      }

      if let newArchEnabled = expoConfig["newArchEnabled"] as? Bool {
        projectData["usesNewArch"] = newArchEnabled
      }

      // Get icon path
      if let icon = expoConfig["icon"] as? String {
        let iconPath = (fullPath as NSString).appendingPathComponent(icon)
        if fileManager.fileExists(atPath: iconPath) {
          projectData["iconPath"] = iconPath
        }
      }

      // Orientation
      if let orientation = expoConfig["orientation"] as? String {
        projectData["orientation"] = orientation
      }

      // Platforms
      if let platforms = expoConfig["platforms"] as? [String] {
        if let jsonData = try? JSONSerialization.data(withJSONObject: platforms),
           let jsonString = String(data: jsonData, encoding: .utf8) {
          projectData["platforms"] = jsonString
        }
      }

      // Background color
      if let backgroundColor = expoConfig["backgroundColor"] as? String {
        projectData["backgroundColor"] = backgroundColor
      }

      // Primary color
      if let primaryColor = expoConfig["primaryColor"] as? String {
        projectData["primaryColor"] = primaryColor
      }

      // iOS bundle identifier
      if let ios = expoConfig["ios"] as? [String: Any],
         let bundleIdentifier = ios["bundleIdentifier"] as? String {
        projectData["bundleIdentifier"] = bundleIdentifier
      }

      // Android package
      if let android = expoConfig["android"] as? [String: Any],
         let packageName = android["package"] as? String {
        projectData["androidPackage"] = packageName
      }

      // Permissions
      if let permissions = expoConfig["permissions"] as? [String] {
        if let jsonData = try? JSONSerialization.data(withJSONObject: permissions),
           let jsonString = String(data: jsonData, encoding: .utf8) {
          projectData["permissions"] = jsonString
        }
      }

      // Splash
      if let splash = expoConfig["splash"] as? [String: Any] {
        if let jsonData = try? JSONSerialization.data(withJSONObject: splash),
           let jsonString = String(data: jsonData, encoding: .utf8) {
          projectData["splash"] = jsonString
        }
      }

      // Updates
      if let updates = expoConfig["updates"] as? [String: Any] {
        if let jsonData = try? JSONSerialization.data(withJSONObject: updates),
           let jsonString = String(data: jsonData, encoding: .utf8) {
          projectData["updates"] = jsonString
        }
      }

      // Plugins
      if let plugins = expoConfig["plugins"] as? [Any] {
        if let jsonData = try? JSONSerialization.data(withJSONObject: plugins),
           let jsonString = String(data: jsonData, encoding: .utf8) {
          projectData["plugins"] = jsonString
        }
      }

      // Extra
      if let extra = expoConfig["extra"] as? [String: Any] {
        if let jsonData = try? JSONSerialization.data(withJSONObject: extra),
           let jsonString = String(data: jsonData, encoding: .utf8) {
          projectData["extra"] = jsonString
        }
      }
    }

    // Calculate folder sizes
    let sizes = getFolderSizes(path: fullPath)
    projectData["folderSize"] = formatBytes(bytes: sizes.total)
    projectData["projectSize"] = formatBytes(bytes: sizes.withoutNodeModules)

    return projectData
  }

  private func getFolderSizes(path: String) -> (total: Int64, withoutNodeModules: Int64) {
    let fileManager = FileManager.default
    guard let enumerator = fileManager.enumerator(atPath: path) else {
      return (0, 0)
    }

    var totalSize: Int64 = 0
    var projectSize: Int64 = 0
    var itemCount = 0

    for case let file as String in enumerator {
      // Check for cancellation every 100 items
      itemCount += 1
      if itemCount % 100 == 0 && shouldCancelScan {
        return (totalSize, projectSize)
      }

      let filePath = (path as NSString).appendingPathComponent(file)

      if let attributes = try? fileManager.attributesOfItem(atPath: filePath),
         let fileSize = attributes[.size] as? Int64 {
        totalSize += fileSize

        // Only add to project size if not in node_modules or .git
        if !file.contains("node_modules") && !file.contains(".git") {
          projectSize += fileSize
        }
      }
    }

    return (totalSize, projectSize)
  }

  private func formatBytes(bytes: Int64) -> String {
    let formatter = ByteCountFormatter()
    formatter.allowedUnits = [.useKB, .useMB, .useGB]
    formatter.countStyle = .file
    return formatter.string(fromByteCount: bytes)
  }
}
