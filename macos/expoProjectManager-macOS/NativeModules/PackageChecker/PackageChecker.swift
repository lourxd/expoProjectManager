import Foundation
import React

@objc(PackageChecker)
class PackageChecker: NSObject {

  @objc
  func checkOutdatedPackages(_ projectPath: String,
                             resolver resolve: @escaping RCTPromiseResolveBlock,
                             rejecter reject: @escaping RCTPromiseRejectBlock) {

    DispatchQueue.global(qos: .userInitiated).async {
      let process = Process()
      let pipe = Pipe()

      process.executableURL = URL(fileURLWithPath: "/usr/bin/env")
      process.arguments = ["npm", "outdated", "--json"]
      process.currentDirectoryURL = URL(fileURLWithPath: projectPath)
      process.standardOutput = pipe
      process.standardError = pipe

      do {
        try process.run()
        process.waitUntilExit()

        let data = pipe.fileHandleForReading.readDataToEndOfFile()

        // npm outdated returns exit code 1 when there are outdated packages, which is expected
        // Only treat it as error if we got no data
        if data.isEmpty {
          DispatchQueue.main.async {
            resolve([])
          }
          return
        }

        if let jsonObject = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
          var outdatedPackages: [[String: String]] = []

          for (packageName, info) in jsonObject {
            if let packageInfo = info as? [String: Any] {
              let current = packageInfo["current"] as? String ?? "unknown"
              let wanted = packageInfo["wanted"] as? String ?? "unknown"
              let latest = packageInfo["latest"] as? String ?? "unknown"

              outdatedPackages.append([
                "name": packageName,
                "current": current,
                "wanted": wanted,
                "latest": latest
              ])
            }
          }

          DispatchQueue.main.async {
            resolve(outdatedPackages)
          }
        } else {
          DispatchQueue.main.async {
            resolve([])
          }
        }
      } catch {
        DispatchQueue.main.async {
          reject("PACKAGE_CHECK_ERROR", "Failed to check outdated packages: \(error.localizedDescription)", error)
        }
      }
    }
  }
}
