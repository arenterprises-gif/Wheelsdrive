export const DEALER_WHATSAPP = '919506365650'

export const openWhatsApp = (message: string) => {
  const url = `https://wa.me/${DEALER_WHATSAPP}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

export const carInquiryMessage = (car: { brand: string; model: string; year: number; price: number }) =>
  `Namaste! Main ${car.brand} ${car.model} (${car.year}) ke baare mein poochna chahta hoon jo WheelsDrive par listed hai at ₹${car.price.toLocaleString('en-IN')}. Kya ye available hai?`

export const generalInquiryMessage = () =>
  `Namaste! Main WheelsDrive se contact kar raha hoon. Mujhe used cars ke baare mein jaankari chahiye.`
