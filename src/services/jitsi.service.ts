import jsonwebtoken from 'jsonwebtoken'

export class JitsiService {
    static async generateJwtToken(id:any, name:any, email:any) {
        // Define the JWT header
        const header = {
            alg: "HS256",
            typ: "JWT",
            kid: "vpaas-magic-cookie-b9f2d397120a469182119b0903dac4ac/27a1a2"
        };

        // Define the JWT payload
        const payload = {
            aud: "jitsi",
            context: {
                user: {
                    id: id,
                    name: name,
                    avatar: "",
                    email: email,
                    moderator: "true"
                },
                features: {
                    livestreaming: "false",
                    "outbound-call": "false",
                    transcription: "false",
                    recording: "false"
                },
                room: {
                    regex: false
                }
            },
            exp: 1696284052,
            iss: "chat",
            nbf: 1596197652,
            room: "*",
            sub: "vpaas-magic-cookie-b9f2d397120a469182119b0903dac4ac"
        };

        // Define the secret key
        const secretKey = 'rohitpanwar';

        // Sign the JWT
        const token = jsonwebtoken.sign(payload, secretKey, { algorithm: 'HS256', header: header });

        return token;
    }
}