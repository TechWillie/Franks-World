export default function TestInput() {
  return (
    <div style={{ padding: 40 }}>
      <h1>INPUT TEST</h1>

      <input
        type="text"
        placeholder="Type here..."
        style={{
          fontSize: 20,
          padding: 10,
          border: "2px solid black",
          width: "100%",
        }}
        onInput={(e) => console.log("INPUT:", e.target.value)}
      />
    </div>
  );
}
