/**
 * CORASE Transactional Email Service
 * Ready for Resend integration. Currently logs to console for production simulation.
 */

export async function sendWelcomeEmail(userData: any) {
    const { name, email } = userData;

    console.log("-----------------------------------------");
    console.log("📧 SENDING WELCOME EMAIL");
    console.log(`To: ${name} (${email})`);
    console.log(`Message: Welcome to the CORASE Archive. Your journey into minimal excellence starts now.`);
    console.log("-----------------------------------------");

    return { success: true };
}

export async function sendOrderConfirmationEmail(orderData: any) {
    const { _id, items, totalPrice, shippingAddress } = orderData;
    const orderId = _id.toString();

    console.log("-----------------------------------------");
    console.log("📧 SENDING ORDER CONFIRMATION EMAIL");
    console.log(`Order ID: #${orderId.slice(-6)}`);
    console.log(`Customer: ${shippingAddress.fullName} (${shippingAddress.email})`);
    console.log(`Total: ₹${totalPrice}`);
    console.log(`Items:`);
    items.forEach((item: any) => {
        console.log(`  - ${item.name} | Size: ${item.selectedSize} | Qty: ${item.quantity} | Price: ₹${item.price}`);
    });
    console.log(`Shipping to: ${shippingAddress.address}, ${shippingAddress.city}`);
    console.log("-----------------------------------------");

    return { success: true };
}
