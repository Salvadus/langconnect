declare global {
  interface Window {
    $RefreshReg$?: (...args: unknown[]) => void;
    $RefreshSig$?: () => (type: unknown) => unknown;
    __vite_plugin_react_preamble_installed__?: boolean;
  }
}

/**
 * O remote Vite (dev) exige o preamble do plugin-react.
 * Next não tem Vite client — instalamos o do próprio remote.
 */
export function installViteReactPreamble(origin: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.__vite_plugin_react_preamble_installed__) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const refreshUrl = `${origin}/@react-refresh`;
    const clientUrl = `${origin}/@vite/client`;
    const script = document.createElement("script");
    script.type = "module";
    script.textContent = `
      import ${JSON.stringify(clientUrl)};
      import RefreshRuntime from ${JSON.stringify(refreshUrl)};
      RefreshRuntime.injectIntoGlobalHook(window);
      window.$RefreshReg$ = () => {};
      window.$RefreshSig$ = () => (type) => type;
      window.__vite_plugin_react_preamble_installed__ = true;
      window.dispatchEvent(new Event("mfe-vite-preamble"));
    `;
    const timeout = window.setTimeout(() => {
      window.removeEventListener("mfe-vite-preamble", onReady);
      reject(new Error("Timeout no preamble do Vite (o remote não é o dev server)"));
    }, 4000);
    const onReady = () => {
      window.clearTimeout(timeout);
      window.removeEventListener("mfe-vite-preamble", onReady);
      resolve();
    };
    window.addEventListener("mfe-vite-preamble", onReady);
    script.onerror = () => {
      window.clearTimeout(timeout);
      window.removeEventListener("mfe-vite-preamble", onReady);
      reject(new Error("Não carregou o preamble do Vite"));
    };
    document.head.appendChild(script);
  });
}
