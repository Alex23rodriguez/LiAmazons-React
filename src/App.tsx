import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { routes } from "./routes";
import { flattenDeep } from "lodash";

// const App = Client({ game: AmazonsGame });

// export default App;
export const App = () => (
  <Router>
    <main>
      <aside className="sidebar">
        <div className="sidebar-nav" style={{ height: "90%" }}>
          <ul></ul>
        </div>
      </aside>
      <section className="content">
        <Routes>
          {flattenDeep(routes.map((route) => route.routes)).map(
            (route, idx) => {
              return (
                <Route
                  key={idx}
                  path={route.path} // TODO: this may be wrong
                  element={<route.component />}
                />
              );
            }
          )}
        </Routes>
      </section>
    </main>
  </Router>
);
