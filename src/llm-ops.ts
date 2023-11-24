const FaissStoreM = import('langchain/vectorstores/faiss');
const PDFLoaderM = import('langchain/document_loaders/fs/pdf');
const HuggingFaceTransformersEmbeddingsM = import(
  'langchain/embeddings/hf_transformers'
);

export const getVectordb = async (file: Blob) => {
  const FaissStore = (await FaissStoreM).FaissStore;
  const PDFLoader = (await PDFLoaderM).PDFLoader;
  const HuggingFaceTransformersEmbeddings = (
    await HuggingFaceTransformersEmbeddingsM
  ).HuggingFaceTransformersEmbeddings;
  const model = new HuggingFaceTransformersEmbeddings({
    modelName: 'Xenova/all-MiniLM-L6-v2',
  });
  const loader = new PDFLoader(file);

  const vectorStore = await FaissStore.fromDocuments(
    await loader.load(),
    model,
  );
  return vectorStore;

};

export const getVectordbFromIndexDocstore = async (
  docstore:any, 
  index:any, 
  mapping:any) => {
  const FaissStore = (await FaissStoreM).FaissStore;
  const HuggingFaceTransformersEmbeddings = (
    await HuggingFaceTransformersEmbeddingsM
  ).HuggingFaceTransformersEmbeddings;
  const model = new HuggingFaceTransformersEmbeddings({
    modelName: 'Xenova/all-MiniLM-L6-v2',
  });
  const vectorStore = new FaissStore(model, {docstore, index, mapping});
  return vectorStore;
}
// const main = async () => {
//   const vst = await getVectordb();
//   console.log('--------------------');
//   console.log(await vst.similaritySearch('geographical', 1));
// };

// main();
