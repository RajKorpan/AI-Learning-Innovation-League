const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const { svgToDataUri, warnIfSlideHasOverlaps, warnIfSlideElementsOutOfBounds } = require('/home/oai/skills/slides/pptxgenjs_helpers');

const OUT_DIR = path.join(__dirname,'slides');
fs.mkdirSync(OUT_DIR,{recursive:true});

const SHAPE = new pptxgen().ShapeType;
const navy='17324D', blue='2F6FA3', teal='247A78', gold='F3CA60', sky='E5F2F9', ink='22313D', soft='F7FAFC', border='D6E1E8';
const W=13.333, H=7.5;
function imgData(name){return svgToDataUri(fs.readFileSync(path.join(__dirname,'assets/img',name),'utf8'));}
const IMG={
 listen:imgData('visual-listen.svg'), map:imgData('visual-map.svg'), strategy:imgData('visual-strategy.svg'), resources:imgData('visual-resources.svg'), build:imgData('visual-build.svg'), ai:imgData('visual-ai.svg'), test:imgData('visual-test.svg'), share:imgData('visual-share.svg'), check:imgData('visual-check.svg'), small:imgData('visual-small.svg'), club:imgData('visual-club.svg'), quick:imgData('visual-quickbuild.svg'), story:imgData('visual-project-story.svg')
};

function basePpt(){const pptx=new pptxgen(); pptx.layout='LAYOUT_WIDE'; pptx.author='Student AI Learning Innovation League'; pptx.subject='Advisor lesson slides'; pptx.title='Learning League lesson deck'; pptx.company='Hunter College'; pptx.lang='en-US'; pptx.theme={headFontFace:'Aptos Display', bodyFontFace:'Aptos'}; return pptx;}
function addHeader(slide, lesson, short){
  slide.background={color:'FFFFFF'};
  slide.addShape(SHAPE.rect,{x:0,y:0,w:W,h:0.18,fill:{color:gold},line:{color:gold}});
  slide.addText(lesson,{x:0.55,y:0.28,w:4.6,h:0.28,fontSize:9,bold:true,color:teal,margin:0});
  slide.addText(short,{x:9.35,y:0.28,w:3.45,h:0.28,fontSize:9,color:'5D6C78',align:'right',margin:0});
}
function addFooter(slide, n){slide.addText('Student AI Learning Innovation League',{x:0.55,y:7.08,w:4,h:0.22,fontSize:7,color:'7A8790',margin:0}); slide.addText(String(n),{x:12.25,y:7.08,w:0.5,h:0.22,fontSize:7,color:'7A8790',align:'right',margin:0});}
function titleSlide(pptx, lesson, subtitle, image, note){const s=pptx.addSlide(); addHeader(s,lesson,'Advisor slides'); s.addText(lesson,{x:0.65,y:1.25,w:7.2,h:1.0,fontSize:42,bold:true,color:navy,margin:0}); s.addText(subtitle,{x:0.68,y:2.4,w:6.4,h:0.9,fontSize:20,color:ink,breakLine:false,margin:0.05}); s.addShape(SHAPE.roundRect,{x:0.65,y:3.7,w:4.8,h:0.75,rectRadius:0.08,fill:{color:sky},line:{color:border}}); s.addText('Goal: students learn by doing, then build something useful.',{x:0.9,y:3.94,w:4.35,h:0.25,fontSize:13,bold:true,color:navy,margin:0}); s.addImage({data:image,x:8.2,y:1.25,w:3.8,h:3.8}); addFooter(s,1); s.addNotes(note); validate(s,pptx);}
function contentSlide(pptx, lesson, short, title, bullets, image, note, slideNo){const s=pptx.addSlide(); addHeader(s,lesson,short); s.addText(title,{x:0.65,y:0.85,w:6.8,h:0.6,fontSize:29,bold:true,color:navy,margin:0}); const runs=[]; bullets.forEach((b)=>{runs.push({text:b,options:{bullet:{type:'ul'},breakLine:true}});}); s.addText(runs,{x:0.75,y:1.75,w:6.3,h:4.4,fontSize:19,color:ink,fit:'shrink',margin:0.05,breakLine:false,paraSpaceAfterPt:8}); s.addShape(SHAPE.roundRect,{x:8.15,y:1.2,w:4.35,h:4.55,rectRadius:0.08,fill:{color:soft},line:{color:border}}); s.addImage({data:image,x:8.55,y:1.55,w:3.55,h:3.55}); addFooter(s,slideNo); s.addNotes(note); validate(s,pptx);}
function challengeSlide(pptx, lesson, short, title, prompt, choices, answer, image, note, slideNo){const s=pptx.addSlide(); addHeader(s,lesson,short); s.addText(title,{x:0.65,y:0.75,w:8.5,h:0.5,fontSize:28,bold:true,color:navy,margin:0}); s.addText(prompt,{x:0.68,y:1.55,w:7.0,h:0.8,fontSize:20,bold:true,color:ink,margin:0.05,fit:'shrink'}); choices.forEach((c,i)=>{s.addShape(SHAPE.roundRect,{x:0.8,y:2.65+i*0.95,w:6.7,h:0.7,rectRadius:0.06,fill:{color:i===answer?sky:'FFFFFF'},line:{color:i===answer?teal:border,pt:i===answer?2:1}}); s.addText(c,{x:1.0,y:2.84+i*0.95,w:6.2,h:0.25,fontSize:16,color:navy,bold:i===answer,margin:0});}); s.addImage({data:image,x:8.7,y:2.0,w:3.3,h:3.3}); s.addText('Ask students to choose first. Then reveal why.',{x:8.4,y:5.65,w:3.9,h:0.4,fontSize:14,color:teal,bold:true,align:'center',margin:0}); addFooter(s,slideNo); s.addNotes(note); validate(s,pptx);}
function processSlide(pptx, lesson, short, title, steps, image, note, slideNo){const s=pptx.addSlide(); addHeader(s,lesson,short); s.addText(title,{x:0.65,y:0.75,w:8.8,h:0.6,fontSize:29,bold:true,color:navy,margin:0}); steps.forEach((st,i)=>{const y=1.55+i*0.78; s.addShape(SHAPE.ellipse,{x:0.8,y:y,w:0.42,h:0.42,fill:{color:gold},line:{color:gold}}); s.addText(String(i+1),{x:0.92,y:y+0.1,w:0.18,h:0.18,fontSize:10,bold:true,color:navy,margin:0,align:'center'}); s.addText(st,{x:1.42,y:y-0.03,w:6.6,h:0.45,fontSize:18,color:ink,margin:0,fit:'shrink'}); if(i<steps.length-1) s.addShape(SHAPE.line,{x:1.01,y:y+0.45,w:0,h:0.25,line:{color:border,pt:1.4}});}); s.addImage({data:image,x:8.6,y:1.7,w:3.3,h:3.3}); addFooter(s,slideNo); s.addNotes(note); validate(s,pptx);}
function validate(slide,pptx){warnIfSlideHasOverlaps(slide,pptx,{muteContainment:true,ignoreDecorativeShapes:true,ignoreLines:true}); warnIfSlideElementsOutOfBounds(slide,pptx);}

const decks=[
{file:'lesson-1-empathize-slides.pptx',lesson:'Lesson 1 · Empathize',short:'Understand the learner',image:IMG.listen,slides:[
 ['content','Today’s challenge',['Build first, then listen.','Learn what counts as learning.','Ask better interview questions.','Leave with empathy clues—not a solution yet.'],IMG.club,'Use this to frame the session as a League activity, not a conventional class.'],
 ['challenge','Quick build challenge','Make a terrible learning tool in two minutes. What makes it unhelpful?',['It gives answers immediately','It makes the learner think','It uses one clear goal'],0,IMG.quick,'Have students build/sketch something fast. The goal is to experience making before learning how to design well.'],
 ['content','Learning is more than finishing',['Learning means you can use an idea or skill again.','Speed, completion, or liking an activity are not enough.','Look for thinking: explain, retrieve, compare, decide, revise.'],IMG.strategy,'Keep this simple. Students only need a starting definition of learning.'],
 ['content','AI can help—but it is not evidence',['AI can suggest questions, examples, and possibilities.','AI output is a hypothesis to check.','Evidence comes from the learner, the task, and what you observe.'],IMG.ai,'This slide supports responsible AI literacy without going deep into architecture.'],
 ['challenge','Question Detective','Which question would get the most useful answer?',['Would a chatbot help you?','Walk me through what you do when the problem starts.','Why are you bad at this?'],1,IMG.listen,'Let students choose. Then discuss neutral/open questions.'],
 ['process','Interview mission',['Pick who you are listening to.','Choose what you are trying to understand.','Write open starter questions.','Practice if needed.','Interview and take notes.','Turn notes into clues.'],IMG.listen,'Connect to the student Interview Coach sequence.'],
 ['content','What to listen for',['Stories and specific moments','Where the learner hesitates','Workarounds and supports','What they can already do','What they wish worked better'],IMG.check,'Remind students: do not diagnose yet.'],
 ['content','Leave with clues',['What we heard or saw','What we think it might mean','One assumption that changed','One question to carry into Define'],IMG.map,'This is the bridge to Lesson 2.']
]},
{file:'lesson-2-define-slides.pptx',lesson:'Lesson 2 · Define',short:'Find the real learning problem',image:IMG.map,slides:[
 ['content','Today’s challenge',['Turn interview clues into a focused learning problem.','Break the task into small steps.','Find where it starts to get hard.','Write a learning target and success evidence.'],IMG.map,'Frame Define as detective work.'],
 ['content','Small is good',['A broad problem is hard to design for.','A small problem can be tested and improved.','Better: “The learner struggles to count graph intervals.”','Not: “Students are bad at science.”'],IMG.small,'Use a concrete example.'],
 ['process','Build the Task Map',['Name the whole task.','Add one step at a time.','For each step, ask what the learner must know or notice.','Mark what works and where it gets hard.','Write what you actually observed.'],IMG.map,'Walk students through the step-by-step mapper.'],
 ['challenge','Where is the breakdown?','A learner identifies graph axes but cannot tell the value between labeled points. Where should the project focus?',['Everything about graphing','Counting/interpreting intervals','Making a prettier graph'],1,IMG.check,'Reinforce the smallest meaningful focus.'],
 ['content','AI can help you think—but not diagnose',['Use the Task Breakdown Guide only if stuck.','AI may suggest hidden steps.','The output is a draft hypothesis.','Review it with your advisor and evidence.'],IMG.ai,'Explain external AI use.'],
 ['content','Write the learning target',['By the end, the learner should be able to…','We will know because…','This target carries into Prototype and Test.'],IMG.strategy,'This should be one sentence and one observable sign.'],
 ['content','Check together',['Who is learning?','What can they already do?','Where does it start to get hard?','What did we observe?','Is this STEM-related and small enough?'],IMG.check,'Advisor checkpoint before moving to Ideate.']
]},
{file:'lesson-3-ideate-slides.pptx',lesson:'Lesson 3 · Ideate',short:'Choose a way to help',image:IMG.strategy,slides:[
 ['content','Today’s challenge',['Match the learning problem to a strategy.','Try a small learning-science activity.','Use resources you already have.','Generate several possible ideas.'],IMG.strategy,'Keep the emphasis on multiple possibilities.'],
 ['challenge','Which challenge fits best?','Maya knows the definition while reading notes but goes blank during a quiz.',['Remember it','Explain it','Notice mistakes'],0,IMG.strategy,'Use as a quick category practice.'],
 ['content','Learning strategy = what the learner does',['Remember it: try to recall before looking.','Explain it: say why an idea works.','Notice mistakes: find and fix an error.','Use it: apply an idea in a new situation.'],IMG.check,'Use plain language first; formal terms can come second.'],
 ['content','Try the strategy',['Before designing, experience the strategy.','Ask: What did the learner have to do?','What feedback would help?','How would we know it worked?'],IMG.strategy,'Connect to the 2-minute Learning Lab.'],
 ['content','What do you have?',['Paper, cards, markers, whiteboard','Calculator, ruler, objects','People, space, movement','Computer or approved AI tool','Learner interests and constraints'],IMG.resources,'This is the MacGyver/resource inventor idea.'],
 ['process','Five-Idea Sprint',['One no-AI idea','One use-what-you-have idea','One social/people idea','One AI-supported idea','One wild idea'],IMG.build,'Make students generate alternatives before choosing.'],
 ['content','Pick a promising direction',['Does it fit the learning target?','Does the learner do real thinking?','Can we test it soon?','Can it work with available resources?'],IMG.check,'Do not pick only because it seems flashy.']
]},
{file:'lesson-4-prototype-slides.pptx',lesson:'Lesson 4 · Prototype',short:'Build something small',image:IMG.build,slides:[
 ['content','Today’s challenge',['Choose how to build.','Plan the smallest useful prototype.','If building an AI tool, design the AI behavior.','Check whether the tool supports learning.'],IMG.build,'Frame prototype as an experiment.'],
 ['content','Three ways to build',['Make a learning experience: cards, activity, routine, game.','Build an AI learning tool: reusable conversational support.','Go further: advanced digital build when appropriate.'],IMG.resources,'More technology does not mean a better project.'],
 ['content','Do → Notice → Explain → Feedback → Try again',['A tool can include off-screen activity.','AI can support sense-making after the activity.','The learner should still think, explain, decide, or reflect.'],IMG.ai,'This is a signature hybrid pattern.'],
 ['content','See what projects can look like',['Physical slope activity','Vocabulary card game','Word-problem question coach','Hybrid activity + AI reflection'],IMG.story,'Use examples before students choose their own path.'],
 ['process','Plan the smallest version',['What question are we testing?','What does the learner do?','What materials or platform are needed?','What are we not building yet?','How will we know what happened?'],IMG.small,'Small is good.'],
 ['challenge','Strong learning tool check','Does the learner have to do important thinking?',['Yes, they explain or decide','No, the tool gives the answer','Not sure yet'],0,IMG.check,'If not yes, go back before polishing.'],
 ['content','Why Prompt Builder asks so many questions',['Who is learning?','Where are they stuck?','How should they practice?','What should AI do?','How should feedback work?'],IMG.ai,'Show this only if students choose an AI learning tool.'],
 ['process','Prompting is iteration',['Try your own prompt.','Compare with a designed prompt.','Test Draft 1.','Change something.','Test Draft 2.'],IMG.test,'Prompt Builder teaches prompt design, not just prompt generation.']
]},
{file:'lesson-5-test-share-slides.pptx',lesson:'Lesson 5 · Test + Share',short:'Try it, improve it, tell the story',image:IMG.test,slides:[
 ['content','Today’s challenge',['Plan one useful test.','Watch what the learner actually does.','Change one thing because of evidence.','Prepare to share the project story and demo.'],IMG.test,'Keep testing focused and feasible.'],
 ['content','Liking it is not the same as learning',['The learner may enjoy a tool without learning.','Look for the target behavior.','Use the learning objective from Define.'],IMG.check,'Revisit learning objective and evidence.'],
 ['process','Plan and run one test',['Choose the lightest useful test.','State the learning objective.','Decide what to observe.','Run the test neutrally.','Record what happened.'],IMG.test,'Integrates lightest test into the test plan.'],
 ['challenge','Did the tool do too much?','Which test result is most concerning?',['The learner explains the idea independently','The AI immediately gives the answer','The learner asks a clarifying question'],1,IMG.ai,'Make this a signature design question.'],
 ['content','Revise one thing',['Change something because of evidence.','Do not just decorate the prototype.','If possible, retest the same target behavior.'],IMG.build,'Version history matters.'],
 ['content','Learning Showcase story',['The challenge','What we learned from listening','The learning breakdown','What we built','What testing showed','What we changed','What we learned about learning and AI'],IMG.share,'This is not just a product pitch.'],
 ['content','Demo one focused interaction',['Show the learner action.','Explain why it supports learning.','Use a backup if technology fails.','Keep private details out.'],IMG.story,'Students should demonstrate the learning design.'],
 ['content','Ready to share',['Claims match evidence.','The demo is short and clear.','Students can explain limitations.','Everyone has a role.'],IMG.check,'Final advisor check.']
]}
];

async function writeDeck(def){const pptx=basePpt(); titleSlide(pptx,def.lesson,def.short,def.image,`Opening slide for ${def.lesson}. Emphasize that this is a visual facilitation deck, not a replacement for the website lesson plan.`); let n=2; for(const sl of def.slides){ if(sl[0]==='content') contentSlide(pptx,def.lesson,def.short,sl[1],sl[2],sl[3],sl[4],n++); else if(sl[0]==='challenge') challengeSlide(pptx,def.lesson,def.short,sl[1],sl[2],sl[3],sl[4],sl[5],sl[6],n++); else if(sl[0]==='process') processSlide(pptx,def.lesson,def.short,sl[1],sl[2],sl[3],sl[4],n++); }
 await pptx.writeFile({fileName:path.join(OUT_DIR,def.file)});}
(async()=>{for(const d of decks){await writeDeck(d);} console.log('Wrote',decks.length,'decks to',OUT_DIR);})();
