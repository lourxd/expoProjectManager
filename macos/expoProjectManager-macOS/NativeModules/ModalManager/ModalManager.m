#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(PackageModalManager, NSObject)

RCT_EXTERN_METHOD(showPackagesModal:(NSString *)dependencies
                  devDependencies:(NSString *)devDependencies
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(closeModal:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return YES;
}

@end
