export default async function handler(req,res){

    const caso = req.body.caso;

    const prompt = `
Eres un experto en Ingeniería de Requisitos UPC.

Genera EXACTAMENTE:

A) Dos Epics

B) Cuatro User Stories funcionales
(2 por Epic)

C) Dos User Stories no funcionales

D) Story Points para 2 historias
justificando:
- Complejidad
- Riesgo
- Repetición

E) Acceptance Criteria

Usa:

Happy Path
Alternate
Exception

Formato:
Given
When
Then

Caso:
${caso}
`;

    const response =
    await fetch(
        "https://api.deepseek.com/chat/completions",
        {
            method:"POST",
            headers:{
                "Authorization":
                    `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                "Content-Type":
                    "application/json"
            },
            body:JSON.stringify({
                model:"deepseek-chat",
                messages:[
                    {
                        role:"user",
                        content:prompt
                    }
                ]
            })
        }
    );

    const data = await response.json();

    res.status(200).json({
        answer:
            data.choices[0].message.content
    });
}