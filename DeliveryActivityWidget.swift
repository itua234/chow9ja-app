// DeliveryActivityWidget.swift
import WidgetKit
import SwiftUI
import ActivityKit

struct DeliveryActivityWidget: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: DeliveryAttributes.self) { context in
            // Live Activity View
            DeliveryActivityView(context: context)
        } dynamicIsland: { context in
            // Dynamic Island Configuration
            DynamicIsland {
                // Expanded View
                DynamicIslandExpandedRegion(.leading) {
                    Label {
                        Text(context.state.driverName)
                    } icon: {
                        Image(systemName: "person.circle.fill")
                    }
                }
                
                DynamicIslandExpandedRegion(.trailing) {
                    Label {
                        Text(context.state.estimatedArrival)
                    } icon: {
                        Image(systemName: "clock.fill")
                    }
                }
                
                DynamicIslandExpandedRegion(.center) {
                    Map(coordinateRegion: .constant(MKCoordinateRegion(
                        center: context.state.currentLocation,
                        span: MKCoordinateSpan(latitudeDelta: 0.02, longitudeDelta: 0.02)
                    )))
                    .frame(height: 128)
                }
            } compactLeading: {
                // Compact Leading View
                Label {
                    Text(context.state.driverName.prefix(1))
                } icon: {
                    Image(systemName: "person.circle.fill")
                }
            } compactTrailing: {
                // Compact Trailing View
                Text(context.state.estimatedArrival)
            } minimal: {
                // Minimal View
                Image(systemName: "box.truck.fill")
            }
        }
    }
}

struct DeliveryActivityView: View {
    let context: ActivityViewContext<DeliveryAttributes>
    
    var body: some View {
        VStack(spacing: 12) {
            HStack {
                Label {
                    Text(context.state.driverName)
                        .font(.headline)
                } icon: {
                    Image(systemName: "person.circle.fill")
                }
                
                Spacer()
                
                Label {
                    Text(context.state.estimatedArrival)
                        .font(.headline)
                } icon: {
                    Image(systemName: "clock.fill")
                }
            }
            .padding(.horizontal)
            
            Map(coordinateRegion: .constant(MKCoordinateRegion(
                center: context.state.currentLocation,
                span: MKCoordinateSpan(latitudeDelta: 0.02, longitudeDelta: 0.02)
            )))
            .frame(height: 200)
            .cornerRadius(12)
            .padding(.horizontal)
        }
        .padding(.vertical)
    }
}