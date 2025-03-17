export async function authorizeUser() {
    const token = localStorage.getItem('deriv_token');
    if (!token) return null;

    return new Promise((resolve, reject) => {
        const ws = new WebSocket('wss://ws.deriv.com/websockets/v3');

        ws.onopen = () => {
            ws.send(JSON.stringify({ authorize: token }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.error) {
                reject(data.error);
                ws.close();
                return;
            }

            // Fetch balance after authorization
            ws.send(JSON.stringify({ balance: 1, subscribe: 1 }));

            ws.onmessage = (event) => {
                const balanceData = JSON.parse(event.data);
                if (balanceData.msg_type === 'balance') {
                    resolve({
                        balance: balanceData.balance.balance,
                        currency: balanceData.balance.currency,
                        name: data.authorize.full_name,
                    });
                    ws.close();
                }
            };
        };

        ws.onerror = (error) => reject(error);
    });
}
