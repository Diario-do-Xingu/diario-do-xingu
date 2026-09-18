import { Card } from '@/components/ui/card'
import { API_FUTEBOL_WIDGETS } from '@/constants'

export function SoccerWidget() {
  return (
    <Card className="bg-secondary p-3">
      <iframe
        src={API_FUTEBOL_WIDGETS.Rounds}
        title="Rodadas do Campeonato Brasileiro"
        loading="lazy"
        width="100%"
        style={{
          borderRadius: '10px',
          height: '100%',
          minHeight: '700px',
          backgroundColor: 'white',
          // maxWidth: '300px',
        }}
      ></iframe>
    </Card>
  )
}
