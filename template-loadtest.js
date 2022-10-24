import http from 'k6/http';
import { check } from 'k6';
const islocal = false;
export const options = {
    stages: [
        { duration: '60s', target: 1 },
        { duration: '30s', target: 10 },
        { duration: '30s', target: 5 },
        { duration: '30s', target: 0 }
    ]
}

export function setup() {

    const url = 'https://api-login.com/connect/token';

    const payload = {
        username: 'usuario@teste.com.br',
        password: '123456',
        grant_type: 'password',
        client_id: 'clienteId',
        client_secret: 'cliente_secret',
        scope: 'scope1 scope2',
        gmt: '180'
    };

    const params = {
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
            'cache-control': 'no-cache'
        }
    };

    const res = http.post(url, payload, params);

    check(res, { 'Token Request': (r) => r.status == 200 });

    const accessToken = res.json('access_token');
    check(accessToken, { 'Logged in successfully': () => accessToken !== '' });

    return accessToken;
}

export default function (accessToken) {
    let prefix = islocal ? 'http://localhost:44320/' : 'https://remote-api.com.br/';

    const url = prefix + 'my-resource';
    const params = {
        headers: {
            'accept': 'application/json',
            'authorization': 'Bearer ' + accessToken
        }
    };

    const res = http.get(url, params);

    check(res, { 'v1': (res) => res.status == 200 });
}