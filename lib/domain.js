import dns from "dns";

const domain = {
  lookup: (host) => {
    return new Promise((resolve) => {
      dns.lookup(host, (err, ip) => {
        if (err) return resolve(null);
        resolve(ip);
      });
    });
  },

  resolveSrv: (server) => {
    return new Promise((resolve) => {
      dns.resolveSrv(`_minecraft._tcp.${server}`, (err, records) => {
        if (err || records.length < 1) return resolve(null);
        const record = records[0];
        resolve({ host: record.name, port: record.port });
      });
    });
  },
};
export default domain;
