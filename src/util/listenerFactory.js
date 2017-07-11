export default function listenerFactory(name, server) {
    return (fn) => {
        return server.on(name, fn);
    };
}