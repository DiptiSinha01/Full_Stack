import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
      <style>{`
        #root {
          max-width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }
      `}</style>

      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          minHeight: "100vh",
          width: "100vw",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div
          className="card p-4 shadow-sm"
          style={{
            width: "100%",
            maxWidth: "420px",
            borderRadius: "14px",
          }}
        >
          <h3 className="text-center fw-bold mb-4">
            Learning Bootstrap
          </h3>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter your name"
          />

          <input
            type="email"
            className="form-control mb-4"
            placeholder="Enter your email"
          />

          <button className="btn btn-primary w-100">
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
