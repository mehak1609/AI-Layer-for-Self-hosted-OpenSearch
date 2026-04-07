from sentence_transformers import SentenceTransformer
from opensearchpy import OpenSearch

model = SentenceTransformer('all-mpnet-base-v2')
client = OpenSearch(hosts=[{'host': 'localhost', 'port': 9200}], use_ssl=False)

query = "semantic search kaise kaam karta hai"
vector = model.encode(query).tolist()

response = client.search(
    index='enterprise-docs',
    body={
        "size": 3,
        "query": {
            "knn": {
                "embedding": {
                    "vector": vector,
                    "k": 3
                }
            }
        },
        "_source": ["title", "content", "category"]
    }
)

print(f"\nQuery: {query}")
print("-" * 50)
for hit in response['hits']['hits']:
    print(f"Title:    {hit['_source']['title']}")
    print(f"Category: {hit['_source']['category']}")
    print(f"Score:    {hit['_score']}")
    print(f"Content:  {hit['_source']['content']}")
    print("-" * 50)
