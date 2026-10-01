export default function MementoLogo({ className = 'w-9 h-9' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Memento"
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="50" className="fill-black dark:fill-white" />

      {/* Icon lines */}
      <g
        className="stroke-white dark:stroke-black"
        fill="none"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Sun */}
        <circle cx="60" cy="30" r="5" />

        {/* Left mountain*/}
        <path d="M18 70 L38 30 L58 70" />

        {/* Right mountain */}
        <path d="M58 70 L72 45 L86 70" />
      </g>
    </svg>
  )
}