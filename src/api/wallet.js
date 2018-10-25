import request from '@/utils/request'

export function createKeypair(query) {
    return request({
        url: '/v1/wallet/create-keypair',
        method: 'post',
        params: query
    })
}
