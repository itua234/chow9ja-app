// LiveActivities.swift
import Foundation
import ActivityKit
import UIKit

@objc(LiveActivities)
class LiveActivities: NSObject {
    
    // Dictionary to store active activities
    private var activeActivities: [String: Activity<DeliveryAttributes>] = [:]
    
    @objc func requestPermission(_ resolve: @escaping RCTPromiseResolveBlock,
                                rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.1, *) {
            Task {
                let enabled = await ActivityAuthorizationInfo().areActivitiesEnabled
                resolve(enabled)
            }
        } else {
            resolve(false)
        }
    }
    
    @objc func start(_ activityId: String,
                     content: NSDictionary,
                     resolver resolve: @escaping RCTPromiseResolveBlock,
                     rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.1, *) {
            let attributes = DeliveryAttributes()
            
            // Convert content dictionary to ContentState
            guard let contentState = try? self.createContentState(from: content) else {
                reject("ERROR", "Invalid content format", nil)
                return
            }
            
            do {
                let activity = try Activity.request(
                    attributes: attributes,
                    contentState: contentState,
                    pushType: nil
                )
                
                // Store activity reference
                self.activeActivities[activityId] = activity
                
                // Start monitoring activity updates
                Task {
                    for await state in activity.activityStateUpdates {
                        self.sendEvent(withName: "LiveActivity_\(activityId)_StateUpdate", body: ["state": state.rawValue])
                    }
                }
                
                resolve(activityId)
            } catch {
                reject("ERROR", "Failed to start Live Activity", error)
            }
        } else {
            reject("ERROR", "Live Activities not supported", nil)
        }
    }
    
    @objc func update(_ activityId: String,
                      content: NSDictionary,
                      resolver resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let activity = activeActivities[activityId] else {
            reject("ERROR", "Activity not found", nil)
            return
        }
        
        guard let contentState = try? self.createContentState(from: content) else {
            reject("ERROR", "Invalid content format", nil)
            return
        }
        
        Task {
            await activity.update(using: contentState)
            resolve(true)
        }
    }
    
    @objc func end(_ activityId: String,
                   resolver resolve: @escaping RCTPromiseResolveBlock,
                   rejecter reject: @escaping RCTPromiseRejectBlock) {
        guard let activity = activeActivities[activityId] else {
            reject("ERROR", "Activity not found", nil)
            return
        }
        
        Task {
            await activity.end(dismissalPolicy: .immediate)
            activeActivities.removeValue(forKey: activityId)
            resolve(true)
        }
    }
    
    @objc func endAll(_ resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {
        Task {
            if #available(iOS 16.1, *) {
                for activity in Activity<DeliveryAttributes>.activities {
                    await activity.end(dismissalPolicy: .immediate)
                }
                activeActivities.removeAll()
                resolve(true)
            } else {
                resolve(false)
            }
        }
    }
    
    @objc func getAll(_ resolve: @escaping RCTPromiseResolveBlock,
                      rejecter reject: @escaping RCTPromiseRejectBlock) {
        if #available(iOS 16.1, *) {
            let activities = Activity<DeliveryAttributes>.activities
            let activityData = activities.map { activity -> [String: Any] in
                return [
                    "id": activity.id,
                    "state": activity.activityState.rawValue
                ]
            }
            resolve(activityData)
        } else {
            resolve([])
        }
    }
    
    private func createContentState(from dictionary: NSDictionary) throws -> DeliveryAttributes.ContentState {
        guard let driverName = dictionary["driverName"] as? String,
              let estimatedArrival = dictionary["estimatedArrival"] as? String,
              let locationDict = dictionary["currentLocation"] as? [String: Double],
              let latitude = locationDict["latitude"],
              let longitude = locationDict["longitude"] else {
            throw NSError(domain: "", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid content format"])
        }
        
        return DeliveryAttributes.ContentState(
            driverName: driverName,
            estimatedArrival: estimatedArrival,
            currentLocation: CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
        )
    }
}

// DeliveryAttributes.swift
import ActivityKit
import CoreLocation

struct DeliveryAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var driverName: String
        var estimatedArrival: String
        var currentLocation: CLLocationCoordinate2D
        
        func hash(into hasher: inout Hasher) {
            hasher.combine(driverName)
            hasher.combine(estimatedArrival)
            hasher.combine(currentLocation.latitude)
            hasher.combine(currentLocation.longitude)
        }
    }
}

// LiveActivities-Bridge.m
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(LiveActivities, RCTEventEmitter)

RCT_EXTERN_METHOD(requestPermission:
                  (RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(start:(NSString *)activityId
                  content:(NSDictionary *)content
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(update:(NSString *)activityId
                  content:(NSDictionary *)content
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(end:(NSString *)activityId
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(endAll:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getAll:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)

@end