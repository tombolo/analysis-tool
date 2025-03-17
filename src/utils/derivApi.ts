interface ForgetRequest {
    forget: string; // The 'forget' property should be a string
}

export class DerivAPI {
    private static ws: WebSocket;
    public static isReady = false;
    private static requestQueue: Array<() => void> = [];
    private static reconnectAttempts = 0;
    private static maxReconnectAttempts = 5;
    private static reconnectDelay = 1000; // Start with 1 second delay
    private static appId = 66642;
    private static wsUrl = `wss://ws.binaryws.com/websockets/v3?app_id=${this.appId}`;
    static connection: any;
    static endpoint: string | URL;

    static initConnection(token?: string) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            return;
        }

        this.ws = new WebSocket(this.wsUrl);
        this.ws.onopen = () => {
            console.log('WebSocket connected successfully');
            this.isReady = true;
            this.reconnectAttempts = 0;

            // Process queued requests
            while (this.requestQueue.length > 0) {
                const request = this.requestQueue.shift();
                console.log('Processing queued request...');
                request?.();
            }

            if (token) {
                console.log('Sending authorization request...');
                this.sendRequest({ authorize: token });
            }
        };


        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.isReady = false;
        };
    }

    

    private static sendWhenReady(requestAction: () => void) {
        console.log('Checking WebSocket readiness...');
        if (this.isReady && this.ws.readyState === WebSocket.OPEN) {
            console.log('WebSocket is ready, sending request...');
            requestAction();
            this.processQueue(); // Process the next request in the queue after this one finishes
        } else {
            console.log('WebSocket is not ready, queuing request...');
            this.requestQueue.push(requestAction);
            if (this.ws?.readyState !== WebSocket.CONNECTING) {
                console.log('WebSocket not connecting, reattempting connection...');
                this.initConnection(); // Attempt to reconnect if not already connecting
            }
        }
    }

    private static processQueue() {
        if (this.requestQueue.length > 0) {
            const nextRequest = this.requestQueue.shift();
            if (nextRequest) {
                nextRequest();
            }
        }
    }

    static sendRequest(request: object): Promise<any> {
        return new Promise((resolve, reject) => {
            const timeoutDuration = 30000; // 30 seconds timeout
            let timeoutId: NodeJS.Timeout;

            const handleMessage = (event: MessageEvent) => {
                const response = JSON.parse(event.data);

                // Handle the response based on request type
                if (response.msg_type === Object.keys(request)[0] || response.error?.code) {
                    clearTimeout(timeoutId);
                    this.ws.removeEventListener("message", handleMessage);

                    if (response.error) {
                        reject(new Error(response.error.message));
                    } else {
                        resolve(response);
                    }
                } else {
                    console.log("Received unrelated response:", response);
                }
            };

            const sendRequestAction = () => {
                console.log("Sending request action...");
                this.ws.addEventListener("message", handleMessage);
                this.ws.send(JSON.stringify(request));

                timeoutId = setTimeout(() => {
                    console.log("Request timeout reached");
                    this.ws.removeEventListener("message", handleMessage);
                    reject(new Error("Request timeout"));
                }, timeoutDuration);
            };

            // Ensure the request is only sent when WebSocket is connected
            this.sendWhenReady(sendRequestAction);
        });
    }

    // requestSubscribe: Handles subscribing to a symbol and storing the subscription ID
    static requestSubscribe(request: object, callback: (data: Record<string, unknown>) => void): () => void {
        console.log('Subscribing with request:', request);
        let subscriptionId: string | null = null;

        const handleMessage = (event: MessageEvent) => {
            const response = JSON.parse(event.data);

            if (response.subscription?.id) {
                subscriptionId = response.subscription.id;
            }

            if (response.error) {
                // Handle error if needed
            } else {
                callback(response);  // Call the provided callback with the response data
            }
        };

        this.sendWhenReady(() => {
            this.ws.addEventListener('message', handleMessage);
            this.ws.send(JSON.stringify({ ...request, subscribe: 1 }));
        });

        // Return a function to unsubscribe using the subscription ID
        return () => {
            if (subscriptionId) {
                console.log(`Unsubscribing from subscription ID: ${subscriptionId}`);
                this.requestForget({ forget: subscriptionId }, callback); // Pass the real subscription ID for forget
            } else {
                console.error('No subscription ID available for forget request');
            }
            this.ws?.removeEventListener('message', handleMessage);
        };
    }

    // requestForget: Unsubscribes using the provided symbol subscription ID
    static requestForget(
        request: { forget: string },
        callback?: (data: any) => void
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log("Requesting forget for subscription ID:", request);

            if (!request.forget) {
                console.error("Forget request is missing the subscription ID");
                reject(new Error("Forget request missing subscription ID"));
                return;
            }

            const handleMessage = (event: MessageEvent) => {
                const response = JSON.parse(event.data);
                console.log("📩 WebSocket received:", response);

                if (response.forget) {
                    console.log("✅ Forget successful:", response.forget);

                    if (typeof callback === "function") {
                        callback(response);
                    }

                    this.ws.removeEventListener("message", handleMessage);
                    this.ws.close(); // Close WebSocket after successful forget
                    resolve();
                } else if (response.error) {
                    console.error("❌ Forget error:", response.error.message);
                    reject(new Error(response.error.message));
                } else {
                    console.warn(
                        "⚠️ Unexpected forget response. Possible reason: ID mismatch or delayed response:",
                        response
                    );
                }
            };

            this.sendWhenReady(() => {
                const forgetRequest = {
                    forget: request.forget,
                    req_id: Math.floor(Math.random() * 1000),
                };
                console.log("Sending forget request:", forgetRequest);
                this.ws.addEventListener("message", handleMessage);
                this.ws.send(JSON.stringify(forgetRequest));
            });
        });
    }
}
