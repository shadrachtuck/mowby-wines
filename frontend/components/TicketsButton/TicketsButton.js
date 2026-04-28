/**
 * TicketsButton Component
 * 
 * Displays a button that links to Dice ticketing.
 * 
 * You can either:
 * 1. Use the DICE_EVENT_URL environment variable for a direct link
 * 2. Use the Dice API to fetch event information dynamically
 * 
 * @param {Object} props
 * @param {string} props.eventUrl - Direct URL to Dice event (optional, falls back to env var)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.buttonText - Text for the button (default: "Get Tickets")
 */

export default function TicketsButton({
  eventUrl,
  className = '',
  buttonText = 'Get Tickets',
  style = {},
}) {
  // Get Dice event URL from props or environment variable
  const diceUrl =
    eventUrl ||
    process.env.NEXT_PUBLIC_DICE_EVENT_URL ||
    process.env.DICE_EVENT_URL ||
    'https://dice.fm';

  return (
    <a
      href={diceUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`tickets-button inline-block rounded-[10px] px-8 py-4 text-lg font-semibold font-sans text-white bg-mowby-blue hover:bg-mowby-blue-dark transition-colors no-underline ${className}`}
      style={style}
    >
      {buttonText}
    </a>
  );
}


