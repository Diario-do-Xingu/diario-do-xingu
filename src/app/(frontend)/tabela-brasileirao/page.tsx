import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function TabelaBrasileiraoPage() {
  return (
    <Tabs defaultValue="serie-a" className="container-y-padding container flex flex-col">
      <TabsList className="mx-auto">
        <TabsTrigger value="serie-a">Serie A</TabsTrigger>
        <TabsTrigger value="serie-b">Serie B</TabsTrigger>
      </TabsList>
      <TabsContent value="serie-a">
        <iframe
          src={`https://api.api-futebol.com.br/v1/widgets/tabela?client_id=LMUN57AVY9XJ`}
          width="100%"
          className="h-[600px]"
        />
      </TabsContent>
      <TabsContent value="serie-b">
        <iframe
          src={`https://api.api-futebol.com.br/v1/widgets/tabela?client_id=7KDJD7KWHXPS`}
          width="100%"
          className="h-[600px]"
        />
      </TabsContent>
    </Tabs>
  )
}
