import nltk
from nltk.stem import WordNetLemmatizer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import random

stop_words = set(stopwords.words("english"))
Lemmatizer = WordNetLemmatizer()

# reading both the happy and sad song lyrics that were scraped
sad_file = open('Lyrics_sad.txt', 'r', encoding="utf-8")
sad_lyrics = sad_file.read().split('*')
sad_file.close()

happy_file = open('Lyrics_happy.txt', 'r', encoding="utf-8")
happy_lyrics = happy_file.read().split('*')
happy_file.close()

# list comprehensions would just make the code a lot more cluttered
# setting the features for each happy/sad text then shuffling them
all_songs = []
for song in sad_lyrics:
	all_songs.append((song, 'sad'))

for song in happy_lyrics:
	all_songs.append((song, 'happy'))

random.shuffle(all_songs)

# tokenizing and getting 80th percentile of all words that are most common
happy_songs = word_tokenize(''.join(happy_lyrics))
sad_songs = word_tokenize(''.join(sad_lyrics))
all_words = happy_songs + sad_songs
all_words = nltk.FreqDist(all_words).most_common(768)

# convert to list
all_words = [word[0] for word in all_words]


def tag_feature_words(lyrics):
	words = {}
	lyrics = set(word_tokenize(lyrics))
	for w in all_words:
		words[w] = (w in lyrics)
	return words


feature_sets = [(tag_feature_words(lyrics), sentiment) for (lyrics, sentiment) in all_songs]
print(len(all_songs))
print(len(feature_sets))

training_set = feature_sets[:118]
testing_set = feature_sets[118:]
classifier = nltk.NaiveBayesClassifier.train(training_set)

print((nltk.classify.accuracy(classifier, testing_set)) * 100)

classifier.show_most_informative_features(20)
