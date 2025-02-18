import { useState, useEffect, useCallback, useMemo, Profiler } from 'react';
// ... other imports remain the same

// Custom hook for performance measurements
const usePerformanceMetrics = () => {
    const [metrics, setMetrics] = useState({
        renderCount: 0,
        totalRenderTime: 0,
        averageRenderTime: 0,
        lastRenderTime: 0
    });

    const onRenderCallback = useCallback((
        id: string,
        phase: "mount" | "update",
        actualDuration: number,
        baseDuration: number,
        startTime: number,
        commitTime: number
    ) => {
        setMetrics(prev => {
            const newRenderCount = prev.renderCount + 1;
            const newTotalTime = prev.totalRenderTime + actualDuration;
            return {
                renderCount: newRenderCount,
                totalRenderTime: newTotalTime,
                averageRenderTime: newTotalTime / newRenderCount,
                lastRenderTime: actualDuration
            };
        });
    }, []);

    return { metrics, onRenderCallback };
};

const Dashboard = () => {
    const { metrics, onRenderCallback } = usePerformanceMetrics();
    const [showMetrics, setShowMetrics] = useState(false);
    
    // Original state declarations...

    // Performance testing function
    const runPerformanceTest = useCallback(async () => {
        console.time('stateUpdate');
        // Simulate multiple state updates
        for(let i = 0; i < 100; i++) {
            setInputs(prev => ({...prev, amount: `${Math.random() * 1000}`}));
        }
        console.timeEnd('stateUpdate');
    }, []);

    // Component to display metrics
    const PerformanceMetrics = () => (
        <View className="p-4 bg-gray-100 rounded-lg mb-4">
            <Text className="font-primary">Performance Metrics:</Text>
            <Text>Render Count: {metrics.renderCount}</Text>
            <Text>Last Render Time: {metrics.lastRenderTime.toFixed(2)}ms</Text>
            <Text>Average Render Time: {metrics.averageRenderTime.toFixed(2)}ms</Text>
            <Text>Total Render Time: {metrics.totalRenderTime.toFixed(2)}ms</Text>
        </View>
    );

    return (
        <Profiler id="Dashboard" onRender={onRenderCallback}>
            <ScreenLayout 
                className="pt-[10px]" 
                contentContainerStyle={{}}
                scrollViewProps={{}}
            >
                <View className="px-[17.5] flex-1">
                    {/* Debug controls */}
                    <View className="flex-row justify-between mb-4">
                        <Pressable 
                            onPress={() => setShowMetrics(!showMetrics)}
                            className="bg-blue-500 p-2 rounded"
                        >
                            <Text className="text-white">Toggle Metrics</Text>
                        </Pressable>
                        <Pressable 
                            onPress={runPerformanceTest}
                            className="bg-green-500 p-2 rounded"
                        >
                            <Text className="text-white">Run Performance Test</Text>
                        </Pressable>
                    </View>

                    {showMetrics && <PerformanceMetrics />}

                    {/* Rest of your Dashboard component... */}
                </View>
            </ScreenLayout>
        </Profiler>
    );
};

// For comparing optimized vs unoptimized versions
const withoutOptimization = {
    handleFocus: (name: string) => {
        return (value: string) => {
            setInputs(values => ({...values, [name]: value}));
        };
    },
    quickActionProps: {
        onSendPress: () => router.push("/send"),
        onAddFundsPress: () => refRBSheet.current.open(),
        onRequestPress: () => console.log("request money"),
        onMorePress: async (message = "Compliments of the season!!!") => {
            const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
            await Linking.openURL(url);
        }
    }
};

export default Dashboard;


