/**
 * Тестове по английски език за 5. клас.
 * Избор от 3 отговора и попълване (type: 'text').
 */

export const ENGLISH_LANGUAGE_REVISION_QUESTIONS = [
  // Grammar – verbs (Exercise 1)
  { q: "He's a teacher. He ___ in a school in Madrid.", correct: "works", wrong1: "don't work", wrong2: "comes" },
  { q: "My cousins ___ in the UK. They live in Germany.", correct: "don't live", wrong1: "live", wrong2: "work" },
  { q: "Maria ___ tennis or basketball. She hates sport.", correct: "doesn't play", wrong1: "plays", wrong2: "takes" },
  { q: "I ___ Polish. I only speak English.", correct: "don't speak", wrong1: "speak", wrong2: "come" },
  { q: "My sister ___ very good photos of animals.", correct: "takes", wrong1: "don't take", wrong2: "works" },
  { q: "Do you ___ from America?", correct: "come", wrong1: "not come", wrong2: "speak" },
  // Grammar – pronouns (Exercise 2)
  { q: "A: Do you like rock music? B: No, I hate ___.", correct: "it", wrong1: "him", wrong2: "us" },
  { q: "A: My mum likes The Beatles! B: My mum likes ___, too.", correct: "them", wrong1: "it", wrong2: "her" },
  { q: "A: Is this your book? B: Yes, please give it to ___.", correct: "me", wrong1: "him", wrong2: "us" },
  { q: "A: Do you like Nicole Kidman? B: No, I'm not keen on ___.", correct: "her", wrong1: "him", wrong2: "them" },
  { q: "A: Are these your brothers with you? B: Yes, it's a photo of ___ on our holiday.", correct: "them", wrong1: "us", wrong2: "me" },
  // Vocabulary – jobs and places (Exercise 3)
  { q: "Where does a plumber work?", correct: "building site", wrong1: "hospital", wrong2: "school" },
  { q: "Where does a doctor work?", correct: "hospital", wrong1: "shop", wrong2: "farm" },
  { q: "Where does a teacher work?", correct: "school", wrong1: "film studio", wrong2: "office" },
  { q: "Where does a secretary work?", correct: "office", wrong1: "building site", wrong2: "farm" },
  { q: "Where does a farmer work?", correct: "farm", wrong1: "hospital", wrong2: "shop" },
  { q: "Where does an actor work?", correct: "film studio", wrong1: "school", wrong2: "building site" },
  // Vocabulary – scrambled adjectives (Exercise 4): bretrile, looc, tictafans, gorbin, tagre, tanibrili, drew, fulwa, nynut
  { q: "Rearrange the letters to make an adjective of opinion: bretrile", correct: "terrible", wrong1: "brilliant", wrong2: "tablet" },
  { q: "Rearrange the letters to make an adjective of opinion: looc", correct: "cool", wrong1: "cold", wrong2: "pool" },
  { q: "Rearrange the letters to make an adjective of opinion: tictafans", correct: "fantastic", wrong1: "fantasy", wrong2: "fact" },
  { q: "Rearrange the letters to make an adjective of opinion: gorbin", correct: "boring", wrong1: "going", wrong2: "bring" },
  { q: "Rearrange the letters to make an adjective of opinion: tagre", correct: "great", wrong1: "target", wrong2: "gate" },
  { q: "Rearrange the letters to make an adjective of opinion: tanibrili", correct: "brilliant", wrong1: "terrible", wrong2: "natural" },
  { q: "Rearrange the letters to make an adjective of opinion: drew", correct: "weird", wrong1: "red", wrong2: "word" },
  { q: "Rearrange the letters to make an adjective of opinion: fulwa", correct: "awful", wrong1: "full", wrong2: "law" },
  { q: "Rearrange the letters to make an adjective of opinion: nynut", correct: "funny", wrong1: "nut", wrong2: "tunnel" },
  // Phrases (Exercise 5)
  { q: "A: Can I borrow your camera, please? B: ___", correct: "Yes, OK.", wrong1: "That's right.", wrong2: "Don't look at me!" },
  { q: "A: Look, here's my new iPad. B: ___", correct: "Cool!", wrong1: "Yes, OK.", wrong2: "That's right." },
  // Conversation Rob & Liz (Exercise 6)
  { q: "Rob: Do you want to watch my new DVD? Liz: ___", correct: "Yes, OK. What film is it?", wrong1: "Who's in it?", wrong2: "Oh, I love him." },
  { q: "Rob: It's called Alice in Wonderland. Liz: ___", correct: "Who's in it?", wrong1: "Yes, OK. What film is it?", wrong2: "I'm not keen on her." },
  { q: "Rob: Johnny Depp. Liz: ___", correct: "Oh, I love him. I think he's fantastic.", wrong1: "He's awful.", wrong2: "Who's in it?" },
  { q: "Rob: Me, too. What do you think of Helena Bonham Carter? She's in it, too. Liz: ___", correct: "I'm not keen on her. She's weird.", wrong1: "Oh, I love him.", wrong2: "Yes, OK. What film is it?" },
];

/** Test 1: Have / Go / Do / Get – 5th grade English */
export const ENGLISH_HAVE_GO_DO_GET_QUESTIONS = [
  { q: "I ______ up at 7 o'clock every day.", correct: "get", wrong1: "have", wrong2: "do" },
  { q: "She ______ to school by bus.", correct: "goes", wrong1: "has", wrong2: "gets" },
  { q: "We ______ homework in the afternoon.", correct: "do", wrong1: "have", wrong2: "get" },
  { q: "They ______ breakfast at 8 a.m.", correct: "have", wrong1: "go", wrong2: "do" },
  { q: "He ______ to bed at 10 p.m.", correct: "goes", wrong1: "does", wrong2: "has" },
  { q: "I ______ dressed before school.", correct: "get", wrong1: "go", wrong2: "do" },
  { q: "She ______ a shower in the morning.", correct: "has", wrong1: "does", wrong2: "goes" },
  { q: "We ______ to football practice on Mondays.", correct: "go", wrong1: "have", wrong2: "get" },
  { q: "He ______ his teeth before bed.", correct: "does", wrong1: "gets", wrong2: "goes" },
  { q: "I ______ home at 4 p.m.", correct: "get", wrong1: "do", wrong2: "have" },
  { q: "I ______ lunch at school.", correct: "have", wrong1: "go", wrong2: "get" },
  { q: "She ______ up early.", correct: "gets", wrong1: "has", wrong2: "goes" },
  { q: "We ______ shopping on Saturday.", correct: "go", wrong1: "have", wrong2: "get" },
  { q: "He ______ his homework after dinner.", correct: "does", wrong1: "gets", wrong2: "has" },
  { q: "They ______ to the park in the evening.", correct: "go", wrong1: "have", wrong2: "get" },
  { q: "I ______ dressed quickly.", correct: "get", wrong1: "do", wrong2: "go" },
  { q: "She ______ a bath at night.", correct: "has", wrong1: "gets", wrong2: "goes" },
  { q: "We ______ home late.", correct: "get", wrong1: "have", wrong2: "do" },
  { q: "Match: get ___", correct: "dressed", wrong1: "homework", wrong2: "breakfast" },
  { q: "Match: have ___", correct: "breakfast", wrong1: "to school", wrong2: "homework" },
  { q: "Match: do ___", correct: "homework", wrong1: "to bed", wrong2: "a shower" },
  { q: "Match: go ___", correct: "to school", wrong1: "dressed", wrong2: "breakfast" },
  { q: "Match: have ___ (shower)", correct: "a shower", wrong1: "to school", wrong2: "homework" },
  { q: "Match: go ___ (bed)", correct: "to bed", wrong1: "dressed", wrong2: "breakfast" },
];

/** Test 2: Adverbs of frequency & Transport (by/on/in) – 5th grade English */
export const ENGLISH_ADVERBS_TRANSPORT_QUESTIONS = [
  { q: "I ______ brush my teeth before bed. (every time)", correct: "always", wrong1: "never", wrong2: "sometimes" },
  { q: "She ______ watches TV after school. (3–4 times a week)", correct: "often", wrong1: "never", wrong2: "always" },
  { q: "We ______ eat fast food. (0 times)", correct: "never", wrong1: "always", wrong2: "often" },
  { q: "They ______ go to the park on Sundays.", correct: "usually", wrong1: "never", wrong2: "sometimes" },
  { q: "He ______ forgets his homework. (almost every time)", correct: "often", wrong1: "never", wrong2: "sometimes" },
  { q: "I ______ get up at 7 a.m. (every day)", correct: "always", wrong1: "never", wrong2: "often" },
  { q: "She ______ plays computer games. (2 times a month)", correct: "sometimes", wrong1: "always", wrong2: "never" },
  { q: "We ______ visit our grandparents. (many times)", correct: "often", wrong1: "never", wrong2: "sometimes" },
  { q: "He ______ drinks milk. (not at all)", correct: "never", wrong1: "always", wrong2: "usually" },
  { q: "I ______ help my parents at home.", correct: "usually", wrong1: "never", wrong2: "always" },
  { q: "Which is correct? I go to school by bus. (always)", correct: "I always go to school by bus.", wrong1: "I go always to school by bus.", wrong2: "Always I go to school by bus." },
  { q: "Which is correct? She is late. (never)", correct: "She is never late.", wrong1: "She never is late.", wrong2: "Never she is late." },
  { q: "Which is correct? We play football after school. (often)", correct: "We often play football after school.", wrong1: "We play often football after school.", wrong2: "Often we play football after school." },
  { q: "Which is correct? They are tired in the morning. (sometimes)", correct: "They are sometimes tired in the morning.", wrong1: "They sometimes are tired in the morning.", wrong2: "Sometimes they are tired in the morning." },
  { q: "I go to school ___ bus.", correct: "by", wrong1: "on", wrong2: "in" },
  { q: "She travels ___ train.", correct: "by", wrong1: "on", wrong2: "in" },
  { q: "We go ___ car.", correct: "by", wrong1: "in", wrong2: "on" },
  { q: "They travel ___ plane.", correct: "by", wrong1: "in", wrong2: "on" },
  { q: "He goes to work ___ bike.", correct: "by", wrong1: "on", wrong2: "in" },
  { q: "She travels ___ foot.", correct: "on", wrong1: "by", wrong2: "in" },
];

/** Test 3: Present Simple & at (time) – 5th grade English */
export const ENGLISH_PRESENT_SIMPLE_AT_QUESTIONS = [
  { q: "She ______ school at 8 o'clock. (start / starts)", correct: "starts", wrong1: "start", wrong2: "starting" },
  { q: "I ______ dinner at 7 p.m. (have / has)", correct: "have", wrong1: "has", wrong2: "having" },
  { q: "They ______ football at 5 o'clock. (play / plays)", correct: "play", wrong1: "plays", wrong2: "playing" },
  { q: "He ______ TV at night. (watch / watches)", correct: "watches", wrong1: "watch", wrong2: "watching" },
  { q: "We ______ up at 6:30. (get / gets)", correct: "get", wrong1: "gets", wrong2: "getting" },
  { q: "My dad ______ to work at 9 a.m. (go / goes)", correct: "goes", wrong1: "go", wrong2: "going" },
  { q: "I ______ my homework at 4 o'clock. (do / does)", correct: "do", wrong1: "does", wrong2: "doing" },
  { q: "Anna ______ a book at bedtime. (read / reads)", correct: "reads", wrong1: "read", wrong2: "reading" },
  { q: "The lesson ______ at 2 p.m. (finish / finishes)", correct: "finishes", wrong1: "finish", wrong2: "finishing" },
  { q: "Tom and Ben ______ lunch at noon. (eat / eats)", correct: "eat", wrong1: "eats", wrong2: "eating" },
  { q: "I wake up ___ 7 o'clock.", correct: "at", wrong1: "in", wrong2: "on" },
  { q: "She goes to bed ___ night.", correct: "at", wrong1: "in", wrong2: "on" },
  { q: "We meet ___ 5:30 p.m.", correct: "at", wrong1: "in", wrong2: "on" },
  { q: "He has English ___ noon.", correct: "at", wrong1: "in", wrong2: "on" },
  { q: "They have breakfast ___ 8 a.m.", correct: "at", wrong1: "in", wrong2: "on" },
  { q: "The film starts ___ 6 o'clock.", correct: "at", wrong1: "in", wrong2: "on" },
  { q: "I study ___ the weekend.", correct: "at", wrong1: "in", wrong2: "on" },
  { q: "She calls me ___ midnight.", correct: "at", wrong1: "in", wrong2: "on" },
  { q: "Correct: She go to bed at 10 o'clock.", correct: "She goes to bed at 10 o'clock.", wrong1: "She go to bed at 10 o'clock.", wrong2: "She going to bed at 10 o'clock." },
  { q: "Correct: I has dinner at 7 p.m.", correct: "I have dinner at 7 p.m.", wrong1: "I has dinner at 7 p.m.", wrong2: "I am have dinner at 7 p.m." },
  { q: "Correct: He play football at 5 o'clock.", correct: "He plays football at 5 o'clock.", wrong1: "He play football at 5 o'clock.", wrong2: "He playing football at 5 o'clock." },
  { q: "Correct: We goes to school at 8 a.m.", correct: "We go to school at 8 a.m.", wrong1: "We goes to school at 8 a.m.", wrong2: "We going to school at 8 a.m." },
];

/** Test 4: Time in words and numbers – 5th grade English */
export const ENGLISH_TIME_QUESTIONS = [
  { q: "Write the time in words: 3:00", correct: "three o'clock", wrong1: "half past three", wrong2: "quarter past three" },
  { q: "Write the time in words: 7:15", correct: "quarter past seven", wrong1: "quarter to seven", wrong2: "half past seven" },
  { q: "Write the time in words: 9:30", correct: "half past nine", wrong1: "quarter past nine", wrong2: "quarter to nine" },
  { q: "Write the time in words: 4:45", correct: "quarter to five", wrong1: "quarter past four", wrong2: "half past four" },
  { q: "Write the time in words: 12:00", correct: "twelve o'clock", wrong1: "half past twelve", wrong2: "quarter past twelve" },
  { q: "Write the time in words: 5:10", correct: "ten past five", wrong1: "ten to five", wrong2: "quarter past five" },
  { q: "Write the time in words: 8:20", correct: "twenty past eight", wrong1: "twenty to eight", wrong2: "half past eight" },
  { q: "Write the time in words: 6:35", correct: "twenty-five to seven", wrong1: "twenty-five past six", wrong2: "half past six" },
  { q: "Write the time in words: 10:50", correct: "ten to eleven", wrong1: "ten past ten", wrong2: "quarter to eleven" },
  { q: "Write the time in words: 1:05", correct: "five past one", wrong1: "five to one", wrong2: "quarter past one" },
  { q: "It's half past four. What time is it?", correct: "4:30", wrong1: "4:15", wrong2: "4:45" },
  { q: "It's quarter past nine. What time is it?", correct: "9:15", wrong1: "9:30", wrong2: "9:45" },
  { q: "It's quarter to seven. What time is it?", correct: "6:45", wrong1: "7:15", wrong2: "7:45" },
  { q: "It's ten past three. What time is it?", correct: "3:10", wrong1: "3:50", wrong2: "10:03" },
  { q: "It's twenty to eight. What time is it?", correct: "7:40", wrong1: "8:20", wrong2: "7:20" },
  { q: "It's five past one. What time is it?", correct: "1:05", wrong1: "1:50", wrong2: "5:01" },
  { q: "It's twenty-five past six. What time is it?", correct: "6:25", wrong1: "6:35", wrong2: "5:25" },
  { q: "It's ten to eleven. What time is it?", correct: "10:50", wrong1: "11:10", wrong2: "10:10" },
  { q: "2:30 is:", correct: "half past two", wrong1: "quarter to two", wrong2: "half to two" },
  { q: "11:45 is:", correct: "quarter to twelve", wrong1: "quarter past eleven", wrong2: "half past eleven" },
  { q: "6:15 is:", correct: "quarter past six", wrong1: "quarter to six", wrong2: "half past six" },
  { q: "9:50 is:", correct: "ten to ten", wrong1: "ten past nine", wrong2: "ten to nine" },
  { q: "4:05 is:", correct: "five past four", wrong1: "five to four", wrong2: "half past four" },
  { q: "7:40 is:", correct: "twenty to eight", wrong1: "twenty past seven", wrong2: "forty past seven" },
];

/** История 5 клас – Древна Тракия (по учебника, обобщение и кратки въпроси) */

/** Unit 6c – Once a week: frequency, personality quiz, like/dislike + -ing, surprise & comment */
export const ENGLISH_UNIT_6C_QUESTIONS = [
  // Frequency phrases (quiz options)
  { q: "Which phrase means 'one time in seven days'?", correct: "once a week", wrong1: "once a month", wrong2: "every week" },
  { q: "Which phrase means 'two times in a month'?", correct: "twice a month", wrong1: "twice a week", wrong2: "two months" },
  { q: "Where do we usually put 'every day' in: I play computer games ___?", correct: "at the end: I play computer games every day.", wrong1: "after the verb: I every day play computer games.", wrong2: "at the start: Every day I play computer games." },
  { q: "Complete: How often do you ___ the net?", correct: "surf", wrong1: "surfs", wrong2: "surfing" },
  { q: "Complete: How often do you ___ your English vocabulary?", correct: "revise", wrong1: "revises", wrong2: "revising" },
  { q: "Complete: How often do you ___ out with your friends?", correct: "hang", wrong1: "hangs", wrong2: "hanging" },
  // Like / love / hate + -ing (grammar)
  { q: "I like ___ computer games.", correct: "playing", wrong1: "play", wrong2: "to play" },
  { q: "She loves ___ books.", correct: "reading", wrong1: "read", wrong2: "reads" },
  { q: "I hate ___ English vocabulary.", correct: "revising", wrong1: "revise", wrong2: "revises" },
  { q: "They don't like ___ a sport.", correct: "playing", wrong1: "play", wrong2: "plays" },
  { q: "We can say: I like ___ (noun).", correct: "football", wrong1: "playing football only", wrong2: "to football" },
  // Express surprise and comment
  { q: "Which expression do we use to show surprise?", correct: "Really?", wrong1: "I think so.", wrong2: "Maybe." },
  { q: "Which expression shows positive comment?", correct: "That's great. Well done!", wrong1: "That's awful.", wrong2: "That's not very good." },
  { q: "Which expression shows negative comment?", correct: "That's not very good.", wrong1: "Wow!", wrong2: "That's interesting." },
  { q: "When someone says 'Every day', you can repeat and react with:", correct: "Every day? Wow! That's great.", wrong1: "Every day. So what?", wrong2: "I never." },
  { q: "Which is a way to express surprise?", correct: "You're joking!", wrong1: "That's good.", wrong2: "I don't know." },
  // Activities from the quiz and exercises
  { q: "How often do you go jogging? Choose a frequency phrase.", correct: "three times a week", wrong1: "three weeks", wrong2: "three time a week" },
  { q: "Complete the sentence: Sandra ___ her mobile every evening.", correct: "uses", wrong1: "use", wrong2: "using" },
  { q: "Which sentence is correct?", correct: "I play football twice a week.", wrong1: "I twice a week play football.", wrong2: "I play twice a week football." },
  { q: "How often do you ___ to a party?", correct: "go", wrong1: "goes", wrong2: "going" },
  { q: "How often do you ___ an email?", correct: "write", wrong1: "writes", wrong2: "writing" },
  { q: "How often do you ___ your bike?", correct: "ride", wrong1: "rides", wrong2: "riding" },
  { q: "Which activity fits 'PARTY PERSON'?", correct: "have a barbecue", wrong1: "revise vocabulary", wrong2: "surf the net" },
  { q: "Which activity fits 'COMPUTER KID'?", correct: "chat to friends online", wrong1: "go jogging", wrong2: "have a party" },
  { q: "Which activity fits 'SERIOUS STUDENT'?", correct: "get 100% in a test", wrong1: "ride your bike", wrong2: "hang out with friends" },
  { q: "Which activity fits 'SPORTS STAR'?", correct: "play a sport", wrong1: "write an email", wrong2: "watch a DVD in English" },
  { q: "We ask about frequency with:", correct: "How often do you...?", wrong1: "How many do you...?", wrong2: "How long do you...?" },
  { q: "From the list: get up very late, tidy your bedroom, go to bed early – we use these with:", correct: "How often do you...?", wrong1: "How much...?", wrong2: "Where do you...?" },
];

/**
 * Round up 3 & 6b/6c – въпроси с избор И с написване на отговор.
 * type: 'text' = потребителят пише отговор; acceptedAnswers = приема се всеки от списъка (без значение малки/големи букви).
 */
export const ENGLISH_ROUNDUP_6_WRITE_IN_QUESTIONS = [
  // Round up – Complete the chat (Exercise 1)
  { type: 'text', q: "Where ___ ? (Nero asks DJ Bob)", correct: "do you come from", acceptedAnswers: ["do you come from"] },
  { type: 'text', q: "So, do ___ French?", correct: "you speak", acceptedAnswers: ["you speak"] },
  { type: 'text', q: "My parents ___ English at home, just French.", correct: "don't speak", acceptedAnswers: ["don't speak", "dont speak"] },
  { type: 'text', q: "At school, we ___ in French!", correct: "study", acceptedAnswers: ["study"] },
  { type: 'text', q: "___ come from Argentina? (Do your parents)", correct: "Do your parents", acceptedAnswers: ["Do your parents", "Do your parents "] },
  { type: 'text', q: "Ha, ha, ___. No. (very funny)", correct: "very funny", acceptedAnswers: ["very funny"] },
  { type: 'text', q: "I ___ in Brazil. I live in Argentina!", correct: "don't live", acceptedAnswers: ["don't live", "dont live"] },
  { type: 'text', q: "They ___ in a big hospital here in Buenos Aires.", correct: "work", acceptedAnswers: ["work"] },
  { type: 'text', q: "They're ___. (parents' job)", correct: "doctors", acceptedAnswers: ["doctors"] },
  // Round up – Mike's survey (Exercise 2). Напиши изречението.
  { type: 'text', q: "Mike: He goes to football matches ___. (2 times, month)", correct: "twice a month", acceptedAnswers: ["twice a month", "twice a Month"] },
  { type: 'text', q: "Mike: He ___ three times a week. (take exercise)", correct: "takes exercise", acceptedAnswers: ["takes exercise", "takes exercise three times a week"] },
  { type: 'text', q: "Mike: He visits his grandparents ___. (1 time, month)", correct: "once a month", acceptedAnswers: ["once a month"] },
  { type: 'text', q: "Mike: He eats fast food ___. (2 times, week)", correct: "twice a week", acceptedAnswers: ["twice a week"] },
  { type: 'text', q: "Mike: He eats fruit ___. (3 times, day)", correct: "three times a day", acceptedAnswers: ["three times a day", "3 times a day"] },
  { type: 'text', q: "Mike: He does homework ___. (every, day)", correct: "every day", acceptedAnswers: ["every day"] },
  // 6c – Complete the phrases (frequency)
  { type: 'text', q: "Tuesday / Wednesday / Thursday = ___", correct: "three days a week", acceptedAnswers: ["three days a week", "3 days a week"] },
  { type: 'text', q: "15th May, 30th May, 15th June, 30th June... = ___", correct: "twice a month", acceptedAnswers: ["twice a month", "2 times a month"] },
  { type: 'text', q: "Mon / Tue / Wed / Thu / Fri / Sat / Sun = every day (or ___ )", correct: "seven days a week", acceptedAnswers: ["seven days a week", "every day", "7 days a week"] },
  { type: 'text', q: "10.00, 10.20, 10.40, 11.00... = ___", correct: "every twenty minutes", acceptedAnswers: ["every twenty minutes", "every 20 minutes", "three times an hour"] },
  // 6c – Sort the words: He doesn't like practising the guitar.
  { type: 'text', q: "Sort the words: doesn't / He / the / guitar / like / practising", correct: "He doesn't like practising the guitar.", acceptedAnswers: ["He doesn't like practising the guitar.", "He doesnt like practising the guitar."] },
  { type: 'text', q: "Sort the words: watching / love / DVDs / We", correct: "We love watching DVDs.", acceptedAnswers: ["We love watching DVDs.", "We love watching DVDs"] },
  { type: 'text', q: "Sort the words: like / Does / she / concerts / to / going", correct: "Does she like going to concerts?", acceptedAnswers: ["Does she like going to concerts?", "Does she like going to concerts"] },
  { type: 'text', q: "Sort the words: brother / hates / My / tennis / playing", correct: "My brother hates playing tennis.", acceptedAnswers: ["My brother hates playing tennis.", "My brother hates playing tennis"] },
  // 6b – Put words in order (adverbs of frequency)
  { type: 'text', q: "Put in order: brush / in / my / I / the / always / teeth / morning.", correct: "I always brush my teeth in the morning.", acceptedAnswers: ["I always brush my teeth in the morning.", "I always brush my teeth in the morning"] },
  { type: 'text', q: "Put in order: your / always / eat / breakfast? / sister / Does", correct: "Does your sister always eat breakfast?", acceptedAnswers: ["Does your sister always eat breakfast?", "Does your sister always eat breakfast"] },
  { type: 'text', q: "Put in order: parents / on / work / Sunday. / never / My / go / to", correct: "My parents never go to work on Sunday.", acceptedAnswers: ["My parents never go to work on Sunday.", "My parents never go to work on Sunday"] },
  { type: 'text', q: "Put in order: never / friends / the / evening. / in / phone / I / my", correct: "I never phone my friends in the evening.", acceptedAnswers: ["I never phone my friends in the evening.", "I never phone my friends in the evening"] },
  // Page 32 – Put words in order
  { type: 'text', q: "Put in order: always / bed / go / I / early. / to", correct: "I always go to bed early.", acceptedAnswers: ["I always go to bed early.", "I always go to bed early"] },
  { type: 'text', q: "Put in order: go / We / holiday / twice / on / a / year.", correct: "We go on holiday twice a year.", acceptedAnswers: ["We go on holiday twice a year.", "We go on holiday twice a year"] },
  { type: 'text', q: "Put in order: goes / Sam / swimming / once / a / week.", correct: "Sam goes swimming once a week.", acceptedAnswers: ["Sam goes swimming once a week.", "Sam goes swimming once a week"] },
  { type: 'text', q: "Put in order: sister / My / a / has / shower / twice / day. / a", correct: "My sister has a shower twice a day.", acceptedAnswers: ["My sister has a shower twice a day.", "My sister has a shower twice a day"] },
  // Page 32 – Complete the questions (How often...?)
  { type: 'text', q: "How often ___ to work? (My parents go to work five days a week.)", correct: "do your parents go", acceptedAnswers: ["do your parents go", "do your parents go to work"] },
  { type: 'text', q: "How often ___ English? (I study English twice a week.)", correct: "do you study", acceptedAnswers: ["do you study", "do you study English"] },
  { type: 'text', q: "How often ___ your grandparents? (I visit my grandparents three times a month.)", correct: "do you visit", acceptedAnswers: ["do you visit", "do you visit your grandparents"] },
  { type: 'text', q: "How often ___ TV? (I watch TV every night.)", correct: "do you watch", acceptedAnswers: ["do you watch", "do you watch TV"] },
  // Page 32 – Complete the dialogue (like + -ing)
  { type: 'text', q: "Rob: Yes, I do. I ___ (love/go) to the shopping centre.", correct: "love going", acceptedAnswers: ["love going", "love go"] },
  { type: 'text', q: "Steve: ___ (you/like/surf) the net? Rob: No, I don't.", correct: "Do you like surfing", acceptedAnswers: ["Do you like surfing", "Do you like surfing the net"] },
  { type: 'text', q: "Rob: I ___ (not/like/use) computers.", correct: "don't like using", acceptedAnswers: ["don't like using", "dont like using"] },
  // Donald's week (6b) – избор или кратък текст
  { q: "Donald plays computer games in the evening every day. So he ___ plays computer games in the evening.", correct: "always", wrong1: "sometimes", wrong2: "never" },
  { q: "Donald is late for school on Mon, Tue, Thu but not Wed, Fri. So he is ___ late for school.", correct: "sometimes", wrong1: "always", wrong2: "never" },
];

/**
 * Grammar Summary & 6c/7a – попълване и тестови (a, b, c) по учебника.
 */
export const ENGLISH_GRAMMAR_6ABC_QUESTIONS = [
  // —— Grammar Summary: Possessive of (попълване) ——
  { type: 'text', q: "Write your name at the ___ (top/the page), please.", correct: "top of the page", acceptedAnswers: ["top of the page", "the top of the page"] },
  { type: 'text', q: "Sofia is the ___ (capital/Bulgaria).", correct: "capital of Bulgaria", acceptedAnswers: ["capital of Bulgaria"] },
  { type: 'text', q: "This is the ___ (end/the story).", correct: "end of the story", acceptedAnswers: ["end of the story", "the end of the story"] },
  // —— Object pronouns (Lesson 5c): избор a,b,c ——
  { q: "I like football, but Adam doesn't like ___.", correct: "it", wrong1: "him", wrong2: "them" },
  { q: "Are they your new friends? Can I meet ___?", correct: "them", wrong1: "they", wrong2: "us" },
  { q: "My sister loves that song. Play ___ again.", correct: "it", wrong1: "her", wrong2: "she" },
  { q: "Where is Tom? I need to talk to ___.", correct: "him", wrong1: "he", wrong2: "his" },
  { q: "Mum is waiting. Let's go with ___.", correct: "her", wrong1: "she", wrong2: "us" },
  { q: "The teacher asked ___ a question. (I)", correct: "me", wrong1: "I", wrong2: "my" },
  // —— Present simple + at (попълване) ——
  { type: 'text', q: "What time does the concert start? It ___ seven o'clock.", correct: "starts at", acceptedAnswers: ["starts at", "starts at seven o'clock"] },
  { type: 'text', q: "And what time does it ___? (finish)", correct: "finish", acceptedAnswers: ["finish", "finish at"] },
  { q: "The museum opens ___ nine o'clock.", correct: "at", wrong1: "in", wrong2: "on" },
  { q: "We have English ___ noon.", correct: "at", wrong1: "in", wrong2: "on" },
  // —— Adverbs of frequency (6b): попълване и избор ——
  { type: 'text', q: "I ___ go to bed at nine o'clock. (never) – напишете изречението.", correct: "I never go to bed at nine o'clock.", acceptedAnswers: ["I never go to bed at nine o'clock.", "I never go to bed at nine o'clock"] },
  { q: "Where do we put 'always' in: He is late? (He ___ is late.)", correct: "He is always late.", wrong1: "He always is late.", wrong2: "Always he is late." },
  { q: "My sister ___ has breakfast at home.", correct: "usually", wrong1: "never", wrong2: "sometimes" },
  { q: "We ___ go to school by bus.", correct: "often", wrong1: "never", wrong2: "hardly ever" },
  // —— Lesson 6c: How often + adverbial (попълване) ——
  { type: 'text', q: "How often do you brush your teeth? (twice a day) – кратък отговор.", correct: "Twice a day.", acceptedAnswers: ["Twice a day.", "Twice a day", "I brush my teeth twice a day."] },
  { type: 'text', q: "Do you like surfing the net? – напишете въпроса с you/like/surf.", correct: "Do you like surfing the net?", acceptedAnswers: ["Do you like surfing the net?", "Do you like surfing the net"] },
  { type: 'text', q: "I love ___ to friends on the phone. (chat)", correct: "chatting", acceptedAnswers: ["chatting", "chat to friends"] },
  { type: 'text', q: "I ___ like cooking. (not)", correct: "don't like", acceptedAnswers: ["don't like", "dont like", "do not like"] },
  { type: 'text', q: "She ___ playing the piano. (hate)", correct: "hates", acceptedAnswers: ["hates", "hate"] },
  // —— Lesson 7a: Present continuous – избор a,b,c (по картинките) ——
  { q: "What is she eating? (picture: apple) a) an apple  b) an orange  c) a banana", correct: "an apple", wrong1: "an orange", wrong2: "a banana" },
  { q: "What is he playing? (picture: football) a) tennis  b) football  c) basketball", correct: "football", wrong1: "tennis", wrong2: "basketball" },
  { q: "What is she reading? (picture: magazine) a) a book  b) a magazine  c) a newspaper", correct: "a magazine", wrong1: "a book", wrong2: "a newspaper" },
  { q: "What is he listening to? (picture: MP3) a) the radio  b) an MP3 player  c) a podcast", correct: "an MP3 player", wrong1: "the radio", wrong2: "a podcast" },
  { q: "What is your dad cooking? (picture: chips) a) a cake  b) chips  c) pizza", correct: "chips", wrong1: "a cake", wrong2: "pizza" },
  { q: "What's the weather like? (picture: snow) a) It's raining  b) It's snowing  c) It's sunny", correct: "It's snowing", wrong1: "It's raining", wrong2: "It's sunny" },
  // —— Cinema timetable (Grammar Summary) – избор ——
  { q: "The film 'Not Fair!' has two showings. One is at 18.45. The other is at:", correct: "22.15", wrong1: "19.35", wrong2: "17.20" },
  { q: "Which film has a showing at 19.35?", correct: "Men On Mars", wrong1: "Three In A Boat", wrong2: "The Rock Star" },
  { q: "The Rock Star – second showing is at:", correct: "22.15", wrong1: "18.45", wrong2: "19.35" },
];

/**
 * 6a – Present simple с фиксирани часове, предлог at, имейл със разписания, Marco's routine.
 * По картинките: Grammar (fixed times + at) и Workbook 6a.
 */
export const ENGLISH_6A_FIXED_TIMES_QUESTIONS = [
  // —— Present simple + at, граматика (попълване и избор) ——
  { type: 'text', q: "The museum ___ at nine o'clock. (open)", correct: "opens", acceptedAnswers: ["opens", "opens at nine o'clock"] },
  { type: 'text', q: "The shop ___ at 6 p.m. (close)", correct: "closes", acceptedAnswers: ["closes", "closes at 6 p.m."] },
  { type: 'text', q: "The bus ___ at 11.40 a.m. (arrive)", correct: "arrives", acceptedAnswers: ["arrives", "arrives at 11.40 a.m."] },
  { type: 'text', q: "The match ___ at 4.45 p.m. (finish)", correct: "finishes", acceptedAnswers: ["finishes", "finishes at 4.45 p.m."] },
  { q: "With times we use the preposition:", correct: "at", wrong1: "on", wrong2: "in" },
  { q: "Correct form: The bus ___ at 4 p.m.", correct: "leaves", wrong1: "leave", wrong2: "leaving" },
  { q: "Correct question: ___ the shops open?", correct: "What time do", wrong1: "What time the", wrong2: "What time does the" },
  { q: "School starts ___ 9 a.m.", correct: "at", wrong1: "on", wrong2: "in" },
  // —— Email: European concerts trip (разписания) – избор a,b,c ——
  { q: "Banks ___ at half past nine. (schedule: National Bank 09.30–15.30)", correct: "open", wrong1: "start", wrong2: "leave" },
  { q: "The plane ___ London at twenty past ten.", correct: "leaves", wrong1: "starts", wrong2: "opens" },
  { q: "The plane ___ in Amsterdam at ten past eleven.", correct: "arrives", wrong1: "finishes", wrong2: "closes" },
  { q: "The doors ___ at six. (Concert: Doors open 6 p.m.)", correct: "open", wrong1: "start", wrong2: "arrive" },
  { q: "The concert ___ at quarter past seven.", correct: "starts", wrong1: "opens", wrong2: "arrives" },
  { q: "The concert ___ at ten thirty-five.", correct: "finishes", wrong1: "closes", wrong2: "leaves" },
  { q: "The train to Berlin ___ at five to eleven. (Amsterdam 22.55)", correct: "leaves", wrong1: "opens", wrong2: "starts" },
  { q: "We ___ in Berlin at twenty to six in the morning. (Berlin 05.40)", correct: "arrive", wrong1: "finish", wrong2: "close" },
  // —— Workbook 6a: Complete the sentences (попълване) ——
  { type: 'text', q: "This shop ___ (open) at half past eight.", correct: "opens", acceptedAnswers: ["opens"] },
  { type: 'text', q: "Lessons at our school ___ (start) at eight o'clock.", correct: "start", acceptedAnswers: ["start"] },
  { type: 'text', q: "My last lesson ___ (finish) at half past three.", correct: "finishes", acceptedAnswers: ["finishes"] },
  { type: 'text', q: "My father's office ___ (close) at six p.m.", correct: "closes", acceptedAnswers: ["closes"] },
  { type: 'text', q: "Your train ___ (leave) at ten past nine.", correct: "leaves", acceptedAnswers: ["leaves"] },
  { type: 'text', q: "Trains from London ___ (arrive) here at five past three.", correct: "arrive", acceptedAnswers: ["arrive"] },
  // —— Write questions and answers (попълване) ——
  { type: 'text', q: "What time does the English class start? (5.00) – кратък отговор.", correct: "It starts at five o'clock.", acceptedAnswers: ["It starts at five o'clock.", "It starts at 5.00.", "At five o'clock."] },
  { type: 'text', q: "What time does the concert finish? (9.45) – отговор с It.", correct: "It finishes at 9.45.", acceptedAnswers: ["It finishes at 9.45.", "It finishes at nine forty-five."] },
  { type: 'text', q: "What time does the film start? (6.00) – въпрос с does.", correct: "What time does the film start?", acceptedAnswers: ["What time does the film start?", "What time does the film start"] },
  // —— Marco's daily routine (chart) – избор и попълване ——
  { q: "What time does Marco get up? (chart)", correct: "7.15", wrong1: "7.35", wrong2: "8.15" },
  { q: "What time does Marco have breakfast?", correct: "7.35", wrong1: "7.15", wrong2: "8.15" },
  { q: "What time does Marco go to school?", correct: "8.15", wrong1: "7.35", wrong2: "16.30" },
  { q: "Marco has lunch from 12.30 to 13.30. What does he eat? (chart)", correct: "Pizza and fruit", wrong1: "Eggs", wrong2: "Nothing" },
  { q: "What does Marco never do? (chart)", correct: "Watch TV", wrong1: "Do homework", wrong2: "Play computer games" },
  { q: "When does Marco play computer games? (chart)", correct: "Always, after dinner", wrong1: "Never", wrong2: "In the morning" },
  { type: 'text', q: "Marco goes to bed at ___. (chart: 22.30)", correct: "22.30", acceptedAnswers: ["22.30", "10.30 p.m.", "half past ten"] },
  { type: 'text', q: "Marco has breakfast at 7.35. He eats ___ for breakfast. (chart: Eggs)", correct: "eggs", acceptedAnswers: ["eggs", "Eggs"] },
];

/**
 * Unit 7c – Don't look at the ground: йога инструкции, здравни съвети,
 * части на тялото и болести. Два теста:
 * 1) попълване на упражненията (императиви и здравни съвети);
 * 2) проверка за думи – части на тялото и болести (значение + правопис).
 */

// 1) Попълване на упражненията – страница 92–93 (йога пози + здравни съвети).
export const ENGLISH_UNIT_7C_FILL_QUESTIONS = [
  // Yoga instructions – imperatives (Exercise "Try the tree")
  {
    type: 'text',
    q: "Complete the instruction: ___ look down.",
    correct: "Don't",
    acceptedAnswers: ["Don't", "dont"],
  },
  {
    type: 'text',
    q: "Complete the instruction: Stand with your feet together and your arms down. ___.",
    correct: "Relax",
    acceptedAnswers: ["Relax"],
  },
  {
    type: 'text',
    q: "Complete the instruction: You must wear ___ clothes.",
    correct: "comfortable",
    acceptedAnswers: ["comfortable"],
  },
  {
    type: 'text',
    q: "Complete the instruction: You must '___' to your body.",
    correct: "listen",
    acceptedAnswers: ["listen"],
  },
  // Health rules – practice exercise (Don't/Do + verb)
  {
    type: 'text',
    q: "Complete the rule: ___ go to bed late on school days.",
    correct: "Don't",
    acceptedAnswers: ["Don't", "dont"],
  },
  {
    type: 'text',
    q: "Complete the rule: ___ sport, yoga or other exercise for 20–30 minutes, five days a week.",
    correct: "Do",
    acceptedAnswers: ["Do"],
  },
  {
    type: 'text',
    q: "Complete the rule: ___ plenty of fruit and vegetables.",
    correct: "Eat",
    acceptedAnswers: ["Eat"],
  },
  {
    type: 'text',
    q: "Complete the rule: ___ breakfast every day.",
    correct: "Have",
    acceptedAnswers: ["Have"],
  },
  {
    type: 'text',
    q: "Complete the rule: ___ a lot of chocolate. It’s bad for your teeth.",
    correct: "Don't eat",
    acceptedAnswers: ["Don't eat", "dont eat", "do not eat"],
  },
  {
    type: 'text',
    q: "Complete the rule: ___ TV for hours. It’s bad for your eyes.",
    correct: "Don't watch",
    acceptedAnswers: ["Don't watch", "dont watch", "do not watch"],
  },
  {
    type: 'text',
    q: "Complete the rule: ___ sunglasses and a hat in the sun.",
    correct: "Wear",
    acceptedAnswers: ["Wear"],
  },
];

// 2) Думи – части на тялото и болести: значението и правописът.
export const ENGLISH_UNIT_7C_VOCAB_QUESTIONS = [
  // Parts of the body – matching EN → BG
  {
    type: 'matching',
    q: "Match the parts of the body with their Bulgarian meaning.",
    pairs: [
      ["ankle", "глезен"],
      ["arm", "ръка (цяла)"],
      ["back", "гръб"],
      ["chest", "гръден кош"],
      ["ear", "ухо"],
      ["elbow", "лакът"],
      ["eye", "око"],
      ["face", "лице"],
      ["finger", "пръст (на ръката)"],
      ["foot", "стъпало"],
      ["hair", "коса"],
      ["hand", "длан/ръка"],
      ["head", "глава"],
      ["knee", "коляно"],
      ["leg", "крак"],
      ["mouth", "уста"],
      ["neck", "врат"],
      ["nose", "нос"],
      ["shoulder", "рамо"],
      ["stomach", "стомах/корем"],
      ["teeth", "зъби"],
      ["thumb", "палец (на ръката)"],
      ["toe", "пръст (на крака)"],
      ["tooth", "зъб"],
    ],
  },
  // Spelling – students write the English word from Bulgarian meaning
  {
    type: 'text',
    q: "Write in English: „глезен“. ",
    correct: "ankle",
    acceptedAnswers: ["ankle"],
  },
  {
    type: 'text',
    q: "Write in English: „гръб“. ",
    correct: "back",
    acceptedAnswers: ["back"],
  },
  {
    type: 'text',
    q: "Write in English: „коляно“. ",
    correct: "knee",
    acceptedAnswers: ["knee"],
  },
  {
    type: 'text',
    q: "Write in English: „стъпало“. ",
    correct: "foot",
    acceptedAnswers: ["foot"],
  },
  {
    type: 'text',
    q: "Write in English: „зъби“. ",
    correct: "teeth",
    acceptedAnswers: ["teeth"],
  },
  // Illness vocabulary – matching
  {
    type: 'matching',
    q: "Match each problem with the correct illness/symptom.",
    pairs: [
      ["a headache", "главоболие"],
      ["a stomachache", "болки в стомаха"],
      ["a toothache", "зъбобол"],
      ["a sore throat", "болно гърло"],
      ["a temperature", "температура"],
      ["a cough", "кашлица"],
      ["a cold", "настинка"],
      ["flu", "грип"],
      ["I feel sick / ill.", "Чувствам се зле / болен."],
    ],
  },
  // Illness – spelling
  {
    type: 'text',
    q: "Write in English: „зъбобол“ (with article).",
    correct: "a toothache",
    acceptedAnswers: ["a toothache", "toothache"],
  },
  {
    type: 'text',
    q: "Write in English: „температура“ (като симптом, with article).",
    correct: "a temperature",
    acceptedAnswers: ["a temperature", "temperature"],
  },
];

/**
 * Unit 8a – The Past: was/were (affirmative/negative/questions),
 * past phrases (yesterday, last week, etc.) и типични изрази от диалога.
 * Смесен тест: попълване + избор.
 */
export const ENGLISH_UNIT_8A_PAST_QUESTIONS = [
  // Grammar: was / were – affirmative
  { type: 'text', q: "Complete: I ___ at home all evening.", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "Complete: They ___ at the cinema yesterday.", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "Complete: It ___ very cold last night.", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "Complete: We ___ in London last year.", correct: "were", acceptedAnswers: ["were"] },

  // Negative
  { type: 'text', q: "Complete: I ___ at school yesterday. (negative)", correct: "wasn't", acceptedAnswers: ["wasn't", "was not"] },
  { type: 'text', q: "Complete: They ___ at home last weekend. (negative)", correct: "weren't", acceptedAnswers: ["weren't", "were not"] },

  // Questions with was/were
  { type: 'text', q: "Write the question: you / at the drama club / yesterday evening?", correct: "Were you at the drama club yesterday evening?", acceptedAnswers: ["Were you at the drama club yesterday evening?", "Were you at the drama club yesterday evening"] },
  { type: 'text', q: "Write the question: Where / he / last night?", correct: "Where was he last night?", acceptedAnswers: ["Where was he last night?", "Where was he last night"] },

  // Short answers
  { q: "Choose the correct short answer: Were you at home yesterday?", correct: "Yes, I was.", wrong1: "Yes, I were.", wrong2: "Yes, I am." },
  { q: "Choose the correct short answer: Was she at the sports centre?", correct: "No, she wasn't.", wrong1: "No, she weren't.", wrong2: "No, she didn't." },

  // Past time phrases – vocabulary
  { q: "Which phrase means 'вчера'? ", correct: "yesterday", wrong1: "last week", wrong2: "tomorrow" },
  { q: "Which phrase means 'миналата седмица'?", correct: "last week", wrong1: "next week", wrong2: "this week" },
  { q: "Which phrase means 'вчера вечерта'?", correct: "yesterday evening", wrong1: "this evening", wrong2: "last morning" },
  { q: "Which phrase means 'миналата година'?", correct: "last year", wrong1: "next year", wrong2: "this year" },

  // Dialogue phrases from the lesson (checking meaning/usage)
  { q: "Choose the best reply: 'I was at home all evening.'", correct: "Really? Why?", wrong1: "How often?", wrong2: "Where are you now?" },
  { q: "Choose the best reply: 'The film was really good.'", correct: "That's great.", wrong1: "What time is it?", wrong2: "Never mind." },
  { q: "Choose the best reply: 'My day was terrible.'", correct: "Oh no. Why?", wrong1: "Really? That's great.", wrong2: "See you next week." },

  // Word building: past of be in context
  { type: 'text', q: "Complete the sentence: My friends ___ at my house last Saturday. (be)", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "Complete the sentence: The weather ___ fantastic yesterday. (be)", correct: "was", acceptedAnswers: ["was"] },
];

/**
 * Unit 8a – Practice 1–5 (учебник стр. 40–41):
 * само попълване по изреченията от упражненията.
 */
export const ENGLISH_UNIT_8A_PAST_FILL_QUESTIONS = [
  // Exercise 1 – Circle the correct words (превръщаме в попълване)
  { type: 'text', q: "I ___ late for school yesterday. (was / were)", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "Noah ___ at the club on Saturday. (was / were)", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "The football match ___ very exciting. (was / were)", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "Kate and Emma ___ in my class last year. (was / were)", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "You ___ tired this morning. (was / were)", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "Mel ___ great at the concert last week. (was / were)", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "My friends and I ___ on holiday in Italy last year. (was / were)", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "Yesterday's homework ___ very difficult. (was / were)", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "John's cousins ___ at the café last Saturday. (was / were)", correct: "were", acceptedAnswers: ["were"] },

  // Exercise 2 – Complete the second sentence
  { type: 'text', q: "Today, I'm on holiday. Yesterday, I ___ at school.", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "Today it's sunny. Last week, it ___ sunny.", correct: "wasn't", acceptedAnswers: ["wasn't", "was not"] },
  { type: 'text', q: "Today, we are in English. At nine o'clock this morning, we ___ in an English lesson.", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "At the moment, I'm in my bedroom. Yesterday evening, I ___ in the living room.", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "Today, my parents are at work. Yesterday, they ___ at home.", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "My computer is very old now. In 2005, it ___ very new.", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "Today, Lisa's at a concert. Last night, she ___ at home.", correct: "was", acceptedAnswers: ["was"] },

  // Exercise 3 – Molly's letter (was / were / wasn't / weren't)
  { type: 'text', q: "Dear Sophie, I ___ in London yesterday. (Molly's letter)", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "I ___ on a school trip. (Molly's letter)", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "We ___ on the bus for two hours. (Molly's letter)", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "At 9.15, we ___ outside Buckingham Palace. (Molly's letter)", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "The Queen and Prince Philip ___ there! (Molly's letter)", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "They ___ in Australia. (Molly's letter – negative)", correct: "weren't", acceptedAnswers: ["weren't", "were not"] },
  { type: 'text', q: "At half past eleven, I ___ on the London Eye. (Molly's letter)", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "It ___ very exciting. (Molly's letter)", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "I ___ hungry, but it was lunchtime. (Molly's letter – negative)", correct: "wasn't", acceptedAnswers: ["wasn't", "was not"] },
  { type: 'text', q: "There ___ a long walk along the river first. (Molly's letter)", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "It ___ sunny, but it ___ very hot. (Molly's letter)", correct: "was", acceptedAnswers: ["was"], },

  // Exercise 4 – Questions about the school trip timetable (was / were)
  { type: 'text', q: "Complete the question: What time ___ the students at the bus station at 8 a.m.?", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "Complete the question: Where ___ Molly at 9.15 a.m.?", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "Complete the question: What time ___ she at the London Eye?", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "Complete the question: Where ___ the students from 5 p.m. to 8 p.m.?", correct: "were", acceptedAnswers: ["were"] },

  // Exercise 5 – There was / There were
  { type: 'text', q: "Complete: There ___ some flowers in the vase yesterday morning. (was / were)", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "Complete: There ___ my books in my bag yesterday evening. (was / were)", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "Complete: Today there is only one shop in my street. In 1980, there ___ two shops.", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "Complete: There ___ a lot of people in the park yesterday.", correct: "were", acceptedAnswers: ["were"] },
];

/**
 * Англ. 14.04.2026 – 8a (Past simple of to be / There was-were / past phrases).
 * По упражненията от страниците + подобни задачи.
 */
export const ENGLISH_14_04_2026_QUESTIONS = [
  // По упражнение 1 (was/were)
  { type: 'text', q: "I ___ late for school yesterday. (was/were)", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "Noah ___ at the club on Saturday. (was/were)", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "The football match ___ awesome last night. (was/were)", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "Kate and Emma ___ in my class last year. (was/were)", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "You ___ very tired this morning. (was/were)", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "Mel ___ great in the concert last week. (was/were)", correct: "was", acceptedAnswers: ["was"] },

  // По упражнение 2
  { type: 'text', q: "Today I'm on holiday. Yesterday I ___ at school.", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "Today it's sunny. Last week it ___ sunny.", correct: "wasn't", acceptedAnswers: ["wasn't", "was not"] },
  { type: 'text', q: "At the moment, we're in an English lesson. At nine o'clock this morning we ___ in a maths lesson.", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "Today my parents are at home. Yesterday they ___ at work.", correct: "were", acceptedAnswers: ["were"] },

  // По упражнение 3 (Molly's letter)
  { type: 'text', q: "Dear Sophie, I ___ in London yesterday.", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "At 9.15 we ___ outside Buckingham Palace.", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "They ___ in Australia. (negative)", correct: "weren't", acceptedAnswers: ["weren't", "were not"] },
  { type: 'text', q: "I ___ on the London Eye at half past eleven.", correct: "was", acceptedAnswers: ["was"] },

  // По упражнение 4–5
  { type: 'text', q: "What time ___ the students at the bus station at 8 a.m.?", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "Where ___ Molly at 9.15 a.m.?", correct: "was", acceptedAnswers: ["was"] },
  { type: 'text', q: "There ___ some books in my bag yesterday evening.", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "There ___ some money in my pocket today but last night I had 0.", correct: "wasn't", acceptedAnswers: ["wasn't", "was not"] },

  // Още 10+ подобни задачи от другата страница (grammar + phrases)
  { q: "Choose the correct negative form:", correct: "She wasn't hungry.", wrong1: "She weren't hungry.", wrong2: "She not was hungry." },
  { q: "Choose the correct question:", correct: "Were you late?", wrong1: "You were late?", wrong2: "Was you late?" },
  { q: "Choose the correct short answer: Was it sunny?", correct: "Yes, it was.", wrong1: "Yes, it were.", wrong2: "Yes, it is." },
  { q: "Choose the correct short answer: Were they famous?", correct: "No, they weren't.", wrong1: "No, they wasn't.", wrong2: "No, they aren't." },
  { q: "Complete: We were at school ___ morning.", correct: "yesterday", wrong1: "tomorrow", wrong2: "next" },
  { q: "Complete: He was at the cinema ___ night.", correct: "last", wrong1: "next", wrong2: "tomorrow" },
  { type: 'text', q: "Wh-question: Where ___ you last night?", correct: "were", acceptedAnswers: ["were"] },
  { type: 'text', q: "Wh-question: What ___ there on TV last night?", correct: "was", acceptedAnswers: ["was"] },
  { q: "Choose the correct sentence:", correct: "There was a film on TV.", wrong1: "There were a film on TV.", wrong2: "There was film on TV." },
  { q: "Choose the correct sentence:", correct: "There weren't any chat shows.", wrong1: "There wasn't any chat shows.", wrong2: "There weren't some chat shows." },
  { type: 'text', q: "Correct the mistake: They were here yesterday-night. -> They were here ___ ___.", correct: "last night", acceptedAnswers: ["last night"] },
  { type: 'text', q: "Correct the mistake: Where she was? -> ___ ___ ___?", correct: "Where was she", acceptedAnswers: ["Where was she", "where was she"] },
];

/**
 * Unit 8b – Past Simple of regular verbs + prepositions of motion
 * (по упражненията от страниците 42–43).
 */
export const ENGLISH_UNIT_8B_REGULAR_VERBS_MOTION_QUESTIONS = [
  // Exercise 1: story (past simple)
  { type: 'text', q: "Complete the story: Suddenly, we ___ an old house. (notice)", correct: "noticed", acceptedAnswers: ["noticed"] },
  { type: 'text', q: "Complete the story: We ___ up to the big old door. (walk)", correct: "walked", acceptedAnswers: ["walked"] },
  { type: 'text', q: "Complete the story: Dan ___ at the door. (knock)", correct: "knocked", acceptedAnswers: ["knocked"] },
  { type: 'text', q: "Complete the story: There wasn't anybody there. I ___ to leave. (want)", correct: "wanted", acceptedAnswers: ["wanted"] },
  { type: 'text', q: "Complete the story: We ___ and we ___. (wait / listen)", correct: "waited", acceptedAnswers: ["waited"] },
  { type: 'text', q: "Complete the story: ... and we ___ after five minutes. (listen)", correct: "listened", acceptedAnswers: ["listened"] },
  { type: 'text', q: "Complete the story: The door ___ with a loud BANG! (close)", correct: "closed", acceptedAnswers: ["closed"] },

  // Past simple forms: affirmative/negative
  { q: "Choose the correct affirmative form of 'finish':", correct: "finished", wrong1: "finishd", wrong2: "finisht" },
  { q: "Choose the correct negative sentence:", correct: "I didn't watch a film.", wrong1: "I didn't watched a film.", wrong2: "I not watch a film." },
  { q: "Choose the correct negative sentence:", correct: "He didn't notice us.", wrong1: "He not noticed us.", wrong2: "He didn't noticed us." },
  { q: "Choose the correct sentence:", correct: "They phoned you yesterday.", wrong1: "They phone you yesterday.", wrong2: "They did phoned you yesterday." },

  // Exercise 3: complete with past simple
  { type: 'text', q: "I ___ basketball when I was young. (play)", correct: "played", acceptedAnswers: ["played"] },
  { type: 'text', q: "We ___ to school every day. (walk)", correct: "walked", acceptedAnswers: ["walked"] },
  { type: 'text', q: "I ___ a video last week. (watch)", correct: "watched", acceptedAnswers: ["watched"] },
  { type: 'text', q: "Yesterday, my sister and I ___ dinner. (cook)", correct: "cooked", acceptedAnswers: ["cooked"] },
  { type: 'text', q: "My sister ___ French last year. (study)", correct: "studied", acceptedAnswers: ["studied"] },
  { type: 'text', q: "He ___ in a hospital in 2005. (work)", correct: "worked", acceptedAnswers: ["worked"] },
  { type: 'text', q: "They ___ their English exam last week. (finish)", correct: "finished", acceptedAnswers: ["finished"] },

  // Exercise 4: negatives
  { type: 'text', q: "Darren ___ to go to the concert. (decide, negative)", correct: "didn't decide", acceptedAnswers: ["didn't decide", "did not decide"] },
  { type: 'text', q: "I ___ hard for my exams last week. (study, negative)", correct: "didn't study", acceptedAnswers: ["didn't study", "did not study"] },
  { type: 'text', q: "My parents ___ to go to Spain on holiday. (want, negative)", correct: "didn't want", acceptedAnswers: ["didn't want", "did not want"] },
  { type: 'text', q: "Nelly ___ when she watched the sad film. (cry, negative)", correct: "didn't cry", acceptedAnswers: ["didn't cry", "did not cry"] },

  // Prepositions of motion + exercise 2 rewrites
  { q: "Complete: He walked ___ the house. (out of / across / up)", correct: "out of", wrong1: "across", wrong2: "up" },
  { q: "Complete: He walked ___ the road. (along / into / past)", correct: "along", wrong1: "into", wrong2: "past" },
  { q: "Complete: He climbed ___ the stairs. (up / across / out of)", correct: "up", wrong1: "across", wrong2: "out of" },
  { q: "Complete: He climbed ___ the stairs. (down / into / along)", correct: "down", wrong1: "into", wrong2: "along" },
  { q: "Complete: We looked ___ all the rooms. (in / out of / down)", correct: "in", wrong1: "out of", wrong2: "down" },
  { q: "Complete: Kelly answered the man and talked ___ him. (to / into / across)", correct: "to", wrong1: "into", wrong2: "across" },
];

/**
 * Unit 8b – само попълване (regular verbs + prepositions of motion).
 */
export const ENGLISH_UNIT_8B_FILL_ONLY_QUESTIONS = [
  // Exercise 1
  { type: 'text', q: "Suddenly, we ___ an old house. (notice)", correct: "noticed", acceptedAnswers: ["noticed"] },
  { type: 'text', q: "We ___ up to the big old door. (walk)", correct: "walked", acceptedAnswers: ["walked"] },
  { type: 'text', q: "Dan ___ at the door. (knock)", correct: "knocked", acceptedAnswers: ["knocked"] },
  { type: 'text', q: "I ___ to leave, but we ___ and we ___. (want / wait / listen) – first blank", correct: "wanted", acceptedAnswers: ["wanted"] },
  { type: 'text', q: "I wanted to leave, but we ___ and we listened. (wait)", correct: "waited", acceptedAnswers: ["waited"] },
  { type: 'text', q: "I wanted to leave, but we waited and we ___. (listen)", correct: "listened", acceptedAnswers: ["listened"] },
  { type: 'text', q: "The door ___ with a loud BANG! (close)", correct: "closed", acceptedAnswers: ["closed"] },

  // Exercise 2
  { type: 'text', q: "Dan didn't like to open the door. -> Dan ___ to open the door.", correct: "tried", acceptedAnswers: ["tried"] },
  { type: 'text', q: "They waited for ten minutes. -> They ___ for ten minutes.", correct: "waited", acceptedAnswers: ["waited"] },
  { type: 'text', q: "They climbed down the stairs. -> They ___ down the stairs.", correct: "climbed", acceptedAnswers: ["climbed"] },
  { type: 'text', q: "They looked through the window. -> They ___ through the window.", correct: "looked", acceptedAnswers: ["looked"] },
  { type: 'text', q: "A man asked: 'What do you want?' -> A man ___ 'What do you want?'", correct: "asked", acceptedAnswers: ["asked"] },
  { type: 'text', q: "Kelly answered the man. -> Kelly ___ the man.", correct: "answered", acceptedAnswers: ["answered"] },

  // Exercise 3
  { type: 'text', q: "I ___ basketball when I was young. (play)", correct: "played", acceptedAnswers: ["played"] },
  { type: 'text', q: "I ___ a video last week. (watch)", correct: "watched", acceptedAnswers: ["watched"] },
  { type: 'text', q: "Yesterday, my sister and I ___ dinner. (cook)", correct: "cooked", acceptedAnswers: ["cooked"] },
  { type: 'text', q: "My sister ___ French last year. (study)", correct: "studied", acceptedAnswers: ["studied"] },
  { type: 'text', q: "He ___ in a hospital in 2005. (work)", correct: "worked", acceptedAnswers: ["worked"] },
  { type: 'text', q: "They ___ their English exam last week. (finish)", correct: "finished", acceptedAnswers: ["finished"] },

  // Exercise 4 (negative)
  { type: 'text', q: "Darren ___ to go to the concert. (decide, negative)", correct: "didn't decide", acceptedAnswers: ["didn't decide", "did not decide"] },
  { type: 'text', q: "I ___ hard for my exams last week. (study, negative)", correct: "didn't study", acceptedAnswers: ["didn't study", "did not study"] },
  { type: 'text', q: "My parents ___ to go to Spain on holiday. (want, negative)", correct: "didn't want", acceptedAnswers: ["didn't want", "did not want"] },
  { type: 'text', q: "Nelly ___ when she watched the sad film. (cry, negative)", correct: "didn't cry", acceptedAnswers: ["didn't cry", "did not cry"] },

  // Exercise 5 (webpage + prepositions from box)
  { type: 'text', q: "The first people ___ in our island in 676. (arrive)", correct: "arrived", acceptedAnswers: ["arrived"] },
  { type: 'text', q: "The people ___ the city Willstown because... (call)", correct: "called", acceptedAnswers: ["called"] },
  { type: 'text', q: "In 1821, 73 men ___ the first game of football on the island. (play)", correct: "played", acceptedAnswers: ["played"] },
  { type: 'text', q: "Click here to ___ up the hill and look over the city. (climb)", correct: "climb", acceptedAnswers: ["climb"] },
  { type: 'text', q: "There's a restaurant here. You can eat local fish. Click again to climb ___ the museum. (to)", correct: "to", acceptedAnswers: ["to"] },
  { type: 'text', q: "Click here to go ___ the museum and look at some things inside. (into)", correct: "into", acceptedAnswers: ["into"] },
];

