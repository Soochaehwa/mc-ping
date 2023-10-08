export default domain;

declare namespace domain {
  function lookup(host: string): Promise<string | null>;

  function resolveSrv(
    server: string,
    protocol: string
  ): Promise<{ host: string; port: number } | null>;
}
