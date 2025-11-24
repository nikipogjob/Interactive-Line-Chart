import { useEffect, useState } from "react";
import ConversionChart from "./components/conversion-chart/conversion-chart";

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const rootEl = document.documentElement;
    if (theme === 'dark') {
      rootEl.classList.add('theme-dark');
    } else {
      rootEl.classList.remove('theme-dark');
    }
  }, [theme]);

  return (
    <div>
      <main>
        <ConversionChart
          theme={theme}
          toggleTheme={() =>
            setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
          }
        />
      </main>
    </div>
  );
}

export default App;
