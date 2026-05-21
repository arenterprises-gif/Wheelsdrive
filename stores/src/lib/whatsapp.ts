// WhatsApp Notifications via CallMeBot (Free)
// One-time setup: Admin must send "I allow callmebot to send me messages"
// to +34 644 62 60 11 on WhatsApp to get API key

const ADMIN_PHONE = '919506365650' // Garvit ka number with country code

export async function sendWhatsAppNotification(message: string): Promise<void> {
  // CallMeBot free WhatsApp API
  // Admin needs to register once at callmebot.com
  const apiKey = localStorage.getItem('callmebot_api_key') || ''
  if (!apiKey) return // Skip if not configured

  try {
    const encoded = encodeURIComponent(message)
    await fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${ADMIN_PHONE}&text=${encoded}&apikey=${apiKey}`,
      { method: 'GET', mode: 'no-cors' }
    )
  } catch {
    // Silently fail - notification is non-critical
  }
}

export async function notifyAdminLogin(email: string): Promise<void> {
  const time = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  await sendWhatsAppNotification(
    `🔐 WheelsDrive Admin Login\n\nEmail: ${email}\nTime: ${time}\n\nIf this was not you, change your password immediately.`
  )
}

export async function notifyNewEnquiry(carTitle: string, customerPhone: string): Promise<void> {
  await sendWhatsAppNotification(
    `🚗 New Car Enquiry!\n\nCar: ${carTitle}\nCustomer: ${customerPhone}\n\nRespond quickly for better conversion!`
  )
}

export function openWhatsApp(phone: string, message: string): void {
  const encoded = encodeURIComponent(message)
  window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank')
}
