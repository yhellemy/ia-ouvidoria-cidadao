interface ModelInfo {
  name: string
  contentIndex?: number // Tornando contentIndex opcional
}

// Função para criar a string e documentar os modelos
export function generateModelDocumentation(): string {
  let documentation = '# Modelos por Fornecedor (Vendor)\n\n'

  // Função auxiliar para iterar e adicionar a documentação
  const addModelsToDocumentation = (vendorName: string, models: Record<string, ModelInfo>) => {
    documentation += `## ${vendorName}\n\n`
    documentation += '| Modelo (Enum) | Nome do Modelo | contentIndex |\n'
    documentation += '|---|---|---|\n'

    for (const [modelKey, modelInfo] of Object.entries(models)) {
      const contentIndex = modelInfo.contentIndex !== undefined ? modelInfo.contentIndex : 'N/A' // Trata contentIndex opcional
      documentation += `| ${modelKey} | ${modelInfo.name} | ${contentIndex} |\n`
    }
    documentation += '\n'
  }

  // Itera sobre cada Vendor e seus modelos
  addModelsToDocumentation(Vendors.google, GOOGLE_MODELS)
  addModelsToDocumentation(Vendors.gov, GOV_MODELS)
  addModelsToDocumentation(Vendors.ollama, OLLAMA_MODELS)

  return documentation
}
