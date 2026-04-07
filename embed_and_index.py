from sentence_transformers import SentenceTransformer
from opensearchpy import OpenSearch

print("Model load ho raha hai...")
model = SentenceTransformer('all-mpnet-base-v2')

client = OpenSearch(
    hosts=[{'host': 'localhost', 'port': 9200}],
    use_ssl=False
)

documents = [
    {'title': 'OpenSearch Kya Hai', 'content': 'OpenSearch ek open source search engine hai jo AWS ne banaya hai', 'category': 'intro'},
    {'title': 'Vector Search', 'content': 'Vector search semantic similarity ke basis pe documents dhundhta hai', 'category': 'ai'},
    {'title': 'kNN Algorithm', 'content': 'k nearest neighbors algorithm similar vectors ko find karta hai', 'category': 'ai'},
    {'title': 'Enterprise Search', 'content': 'Enterprise search large organizations mein data sovereignty ke saath kaam karta hai', 'category': 'enterprise'},
    {'title': 'Relevance Tuning', 'content': 'BM25 algorithm se search results ki relevance improve hoti hai', 'category': 'search'},
]

print("Documents index ho rahe hain...")
for doc in documents:
    vector = model.encode(doc['content']).tolist()
    doc['embedding'] = vector
    response = client.index(index='enterprise-docs', body=doc)
    print(f"Indexed: {doc['title']} -> ID: {response['_id']}")

print("\nSab documents index ho gaye!")
