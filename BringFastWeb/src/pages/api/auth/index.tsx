export default function handler(req, res) {
    if(req.method === 'POST') {
        const auth = req.body

        if(auth.login === 'admin' && auth.password === 'admin'){
            res.status(200).json({
                status: true,
                message: "Login válido",
                token: "123"
            })
        } else{
            res.status(200).json({status: false, message: "Login ou senha inválidos"})
        }
    } else {
        res.status(400).json("Request error")
    }
}