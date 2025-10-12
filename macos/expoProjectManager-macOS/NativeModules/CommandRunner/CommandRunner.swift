import Foundation
import React

@objc(CommandRunner)
class CommandRunner: NSObject {

  @objc
  func run(_ command: NSString,
           resolver resolve: @escaping RCTPromiseResolveBlock,
           rejecter reject: @escaping RCTPromiseRejectBlock) {

    let process = Process()
    let pipe = Pipe()
    process.standardOutput = pipe
    process.standardError = pipe
    process.launchPath = "/bin/zsh" // You can change to /bin/bash if preferred
    process.arguments = ["-c", command as String]

    process.terminationHandler = { task in
      let data = pipe.fileHandleForReading.readDataToEndOfFile()
      let output = String(data: data, encoding: .utf8) ?? ""
      resolve([
        "exitCode": task.terminationStatus,
        "output": output.trimmingCharacters(in: .whitespacesAndNewlines)
      ])
    }

    do {
      try process.run()
    } catch {
      reject("COMMAND_ERROR", "Failed to run command", error)
    }
  }
}
