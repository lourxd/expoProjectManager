#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PackageChecker, NSObject)

RCT_EXTERN_METHOD(checkOutdatedPackages:(NSString *)projectPath
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end
