const Button = ({ title, bg, action }) => {
  return (
    <button
      onClick={action}
      style={{
        background: bg,
        border: "none",
        padding: "10px 20px",
        borderRadius: 5,
        marginBlock: "10px",
        color: "white",
      }}
    >
      {title}
    </button>
  );
};
export default Button;
