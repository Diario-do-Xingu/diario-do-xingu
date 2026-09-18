import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { API_FUTEBOL_WIDGETS } from '@/constants'

export default function TabelaBrasileiraoPage() {
  return (
    <Tabs defaultValue="serie-a" className="container-y-padding container flex flex-col">
      <TabsList className="mx-auto">
        <TabsTrigger value="serie-a">Serie A</TabsTrigger>
        <TabsTrigger value="serie-b">Serie B</TabsTrigger>
      </TabsList>
      <TabsContent value="serie-a">
        <iframe
          title="Tabela do Campeonato Brasileiro Série A"
          src={API_FUTEBOL_WIDGETS.SerieA}
          loading="lazy"
          width="100%"
          className="h-[600px]"
        />
      </TabsContent>
      <TabsContent value="serie-b">
        <iframe
          title="Tabela do Campeonato Brasileiro Série B"
          src={API_FUTEBOL_WIDGETS.SerieB}
          loading="lazy"
          width="100%"
          className="h-[600px]"
        />
      </TabsContent>
    </Tabs>
  )
}
