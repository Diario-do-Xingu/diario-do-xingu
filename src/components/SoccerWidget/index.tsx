export function SoccerWidget() {
  return (
    <iframe
      src="https://api.api-futebol.com.br/v1/widgets/rodadas?client_id=LV2R34S6LAMK"
      title="API Futebol"
      width="100%"
      style={{
        borderRadius: '10px',
        height: '100%',
        minHeight: '700px',
        backgroundColor: 'white',
        // maxWidth: '300px',
      }}
    ></iframe>
  )
}
