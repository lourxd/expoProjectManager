#import "FolderPicker.h"
#import <Cocoa/Cocoa.h>

@implementation FolderPickerModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(pickFolder:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSOpenPanel *panel = [NSOpenPanel openPanel];
    [panel setCanChooseFiles:NO];
    [panel setCanChooseDirectories:YES];
    [panel setAllowsMultipleSelection:NO];
    
    [panel beginWithCompletionHandler:^(NSInteger result) {
      if (result == NSModalResponseOK) {
        NSURL *selectedURL = [[panel URLs] firstObject];
        resolve([selectedURL path]);
      } else {
        resolve([NSNull null]);
      }
    }];
  });
}

@end
