export const Input = ({ label, type = "text", value, onChange, placeholder, required }) => (
  <div className="flex flex-col gap-1">
    {label && <label className="font-bold text-sm uppercase">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="p-3 border-2 border-black shadow-neo-sm focus:outline-none focus:translate-y-0.5 focus:shadow-none transition-all font-medium w-full bg-white"
    />
  </div>
);