#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CommandRunner, NSObject)
RCT_EXTERN_METHOD(run:(NSString *)command
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
@end
