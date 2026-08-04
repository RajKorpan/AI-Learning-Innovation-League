(function(root, factory){
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.LeagueClubPlanner = api;
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => api.init());
    else api.init();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function(){
  'use strict';

  const LABELS = {
    grade: {
      'upper-elementary':'Upper elementary (grades 4–5)',
      'middle':'Middle school (grades 6–8)',
      'high':'High school (grades 9–12)',
      'mixed':'Mixed grade band'
    },
    experience: {
      'new':'Mostly new to design and AI',
      'mixed':'Mixed experience',
      'experienced':'Prior design or AI project experience'
    },
    adults: {
      'one':'One advisor',
      'two':'Two adults or co-advisors',
      'tech-mentor':'Advisor plus technical mentor',
      'multiple':'Multiple classroom adults or mentors'
    },
    event: {
      'school':'School or local in-person event',
      'virtual':'Virtual sharing event',
      'community':'Family or community event',
      'undetermined':'Not yet determined'
    },
    schedule: {
      'five':'Five-week cycle', 'six':'Six-week cycle', 'ten':'Ten-week cycle', 'semester':'Semester cycle'
    }
  };

  const SCHEDULES = {
    five: [
      {label:'Week 1', focus:'Understand and listen', activities:'Human learning, computational thinking, human-versus-machine reasoning, AI literacy, interview practice, and teacher-client and learner empathy.', artifact:'Learning and AI principles plus empathy findings.', checkpoint:'Permission, non-leading questions, and a confirmed teacher-client or backup plan.'},
      {label:'Week 2', focus:'Diagnose and research', activities:'Problem Size Check, task analysis, smallest meaningful component, evidence record, and learning progression.', artifact:'Defined problem, task map, evidence, and progression.', checkpoint:'The problem is observable, right-sized, and supported by verified evidence.'},
      {label:'Week 3', focus:'Imagine and prototype', activities:'Generate at least three product concepts, compare AI and non-AI options, choose a product direction, and build a low-resolution prototype.', artifact:'Concept comparison, product decision, prototype, and test question.', checkpoint:'The product targets the selected component and preserves learner thinking.'},
      {label:'Week 4', focus:'Test and improve', activities:'Team self-test, peer test, teacher-client review, approved learner test, revision, and comparable retest.', artifact:'Testing record and evidence-linked revision.', checkpoint:'Testing records behavior and learning evidence, not only preference.'},
      {label:'Week 5', focus:'Prepare, share, and reflect', activities:'Educational justification, demonstration rehearsal, accessible sharing event, feedback, and team reflection.', artifact:'Presentation, demonstration, limitations, and next-cycle decision.', checkpoint:'Privacy is protected, the demo has a backup, and every student can explain the design.'}
    ],
    six: [
      {label:'Week 1', focus:'Foundation and team setup', activities:'Human learning, computational thinking, human-versus-machine reasoning, AI literacy, team agreements, roles, privacy, accessibility, and interview practice.', artifact:'Team agreement and learning-design principles.', checkpoint:'Students understand the project sequence and responsible-use boundaries.'},
      {label:'Week 2', focus:'Teacher-client and learner empathy', activities:'Conduct interviews, follow stories, synthesize repeated needs, identify contradictions, and record changed assumptions.', artifact:'Empathy findings and insight statements.', checkpoint:'The team has real stakeholder evidence and has not selected a solution prematurely.'},
      {label:'Week 3', focus:'Problem definition and research', activities:'Problem Size Check, task analysis, smallest component, verified learning-science evidence, and progression mapping.', artifact:'Problem statement, task map, evidence record, and progression.', checkpoint:'The bottleneck is specific and the research implications are explicit.'},
      {label:'Week 4', focus:'Ideation and low-resolution prototype', activities:'Compare paper, AI-assisted, conversational, custom, and non-AI options; choose the simplest testable direction.', artifact:'Product decision and low-resolution prototype.', checkpoint:'Platform, privacy, accessibility, and fading decisions are documented.'},
      {label:'Week 5', focus:'Testing and revision', activities:'Stage tests, observe user behavior, compare statements with actions, revise, and retest.', artifact:'Testing and revision log.', checkpoint:'At least one meaningful revision follows directly from evidence.'},
      {label:'Week 6', focus:'Sharing-event preparation and reflection', activities:'Develop the educational justification, rehearse the demonstration, prepare a backup, present, gather feedback, and reflect.', artifact:'Accessible presentation, demonstration, and next-cycle plan.', checkpoint:'The team explains impact cautiously and names limitations.'}
    ],
    ten: [
      {label:'Week 1', focus:'Orientation and foundation', activities:'Team formation, human learning, computational thinking, human-versus-machine reasoning, AI literacy, privacy, and accessibility.', artifact:'Team agreement and design principles.', checkpoint:'Roles, responsibilities, and communication routines are clear.'},
      {label:'Week 2', focus:'Interview practice and preparation', activities:'Practice empathy interviewing, revise questions, prepare consent and note-taking, and schedule the teacher-client.', artifact:'Interview plan and practice feedback.', checkpoint:'Questions are open, concrete, and non-leading.'},
      {label:'Week 3', focus:'Authentic interviews', activities:'Conduct teacher-client and peer learner interviews and capture stories, needs, strategies, barriers, and workarounds.', artifact:'Interview notes.', checkpoint:'Permission and privacy procedures were followed.'},
      {label:'Week 4', focus:'Synthesis and task analysis', activities:'Synthesize findings, define the problem, analyze prerequisites, decisions, errors, load, and the likely bottleneck.', artifact:'Insight statements and task map.', checkpoint:'The selected component is necessary, observable, and feasible.'},
      {label:'Week 5', focus:'Learning-science research', activities:'Verify sources, rate evidence strength, identify myths, record implications, and map the learning progression.', artifact:'Evidence record and progression.', checkpoint:'Important claims can be traced to credible original sources.'},
      {label:'Week 6', focus:'Strategy and product ideation', activities:'Match candidate strategies, generate several product concepts, compare AI value, and select a product track.', artifact:'Strategy rationale and concept comparison.', checkpoint:'The technology choice follows the learning need.'},
      {label:'Week 7', focus:'Prototype and critique', activities:'Build a low-resolution prototype, run a peer critique, review safety and accessibility, and revise the test question.', artifact:'Prototype version 1 and critique notes.', checkpoint:'The prototype tests one important assumption.'},
      {label:'Week 8', focus:'Staged testing', activities:'Conduct self-test, peer test, teacher-client review, and approved learner testing in a realistic context.', artifact:'Observation record.', checkpoint:'The team distinguishes what users said from what users did.'},
      {label:'Week 9', focus:'Revision and retest', activities:'Revise the interaction, content, usability, accessibility, or safeguards and conduct a comparable retest.', artifact:'Prototype version 2 and revision log.', checkpoint:'The team can explain why each major change was made.'},
      {label:'Week 10', focus:'Sharing event and reflection', activities:'Present the project story, demonstrate the tool, explain evidence and limitations, gather feedback, and identify a next cycle.', artifact:'Presentation, demonstration, and reflection.', checkpoint:'The presentation is accessible, privacy-safe, and shared across the team.'}
    ],
    semester: [
      {label:'Weeks 1–2', focus:'Foundation', activities:'Human learning, computational thinking, human-versus-machine reasoning, AI literacy, responsible use, privacy, accessibility, and team agreements.', artifact:'Learning-design principles and team operating agreement.', checkpoint:'The team can distinguish learning support from answer substitution.'},
      {label:'Week 3', focus:'Interview practice', activities:'Practice empathy interviewing, revise questions, assign interview roles, and prepare permissions and note-taking.', artifact:'Interview protocol.', checkpoint:'Students can ask follow-up questions and avoid solution-leading language.'},
      {label:'Weeks 4–5', focus:'Problem discovery', activities:'Conduct teacher-client and learner interviews, synthesize evidence, and identify changed assumptions.', artifact:'Empathy findings.', checkpoint:'The team has evidence from both teaching and learner perspectives.'},
      {label:'Week 6', focus:'Task analysis and problem definition', activities:'Map the task, prerequisites, decisions, errors, cognitive-load points, and smallest meaningful component.', artifact:'Defined problem and task map.', checkpoint:'The problem is specific enough to support and test.'},
      {label:'Weeks 7–8', focus:'Learning-science research and progression', activities:'Verify sources, rate evidence strength, identify myths, map progression, and connect evidence to possible strategies.', artifact:'Evidence record, progression, and preliminary strategy rationale.', checkpoint:'Claims, limitations, and design implications are documented.'},
      {label:'Weeks 9–10', focus:'Ideation and product decision', activities:'Generate varied concepts, compare AI and non-AI directions, review platforms, and select the simplest appropriate product type.', artifact:'Concept portfolio and product decision.', checkpoint:'The team can defend why the selected format fits the learner action.'},
      {label:'Week 11', focus:'Low-resolution prototype', activities:'Create paper flows, storyboards, role-plays, prompt skeletons, sample interactions, or wireframes.', artifact:'Prototype version 1 and test question.', checkpoint:'The prototype is designed to learn, not to impress.'},
      {label:'Weeks 12–13', focus:'Testing', activities:'Conduct peer, teacher-client, and approved learner tests and record behavior, learning evidence, unexpected outcomes, and risks.', artifact:'Testing record.', checkpoint:'The team has enough evidence to decide whether to revise the product or redefine the problem.'},
      {label:'Weeks 14–15', focus:'Revision, retest, and presentation preparation', activities:'Revise, conduct a comparable retest, complete the educational justification, prepare the demo and backup, and rehearse.', artifact:'Revised product, retest record, and presentation.', checkpoint:'Accessibility, privacy, responsible AI, impact, and limitations are explicit.'},
      {label:'Week 16', focus:'Sharing event and next cycle', activities:'Present and demonstrate, gather audience and teacher-client feedback, reflect on team process, and choose a next-cycle question.', artifact:'Sharing-event feedback and next-cycle plan.', checkpoint:'The team treats the event as evidence for continued learning and design.'}
    ]
  };

  function normalize(raw){
    return {
      teamSize: Math.max(1, Math.min(40, Number(raw.teamSize) || 1)),
      grade: raw.grade || 'high',
      experience: raw.experience || 'new',
      format: raw.format || 'Small-group team',
      schedule: raw.schedule || 'five',
      meeting: raw.meeting || '60 minutes',
      frequency: raw.frequency || 'Once per week',
      adults: raw.adults || 'one',
      client: raw.client || 'Not yet identified',
      tech: raw.tech || 'Not yet confirmed',
      family: raw.family || 'Not yet started',
      event: raw.event || 'undetermined',
      access: (raw.access || '').trim(),
      supports: Array.from(new Set(raw.supports || []))
    };
  }

  function label(group, key){ return (LABELS[group] && LABELS[group][key]) || key; }
  function hasSupport(cfg, value){ return cfg.supports.includes(value); }
  function addUnique(arr, value){ if(value && !arr.includes(value)) arr.push(value); }
  function pushPriority(list, level, text, reason){
    if(!list.some(x => x.text === text)) list.push({level, text, reason});
  }

  function parseAccessNeeds(text){
    const raw = (text || '').toLowerCase();
    const results = [];
    const add = (category, recommendation) => {
      if(!results.some(x => x.category === category)) results.push({category, recommendation});
    };
    const any = terms => terms.some(t => raw.includes(t));
    if(any(['language','translation','interpreter','multilingual','bilingual','english learner','ell','esl']))
      add('Language access','Provide plain-language materials, translated or bilingual communication when available, interpretation for meetings or events, and more than one way to respond.');
    if(any(['reading','dyslexia','literacy','text','comprehension']))
      add('Reading access','Chunk directions, use readable formatting, provide examples and audio or read-aloud options when appropriate, and check understanding rather than assuming difficulty with the concept.');
    if(any(['visual','blind','low vision','screen reader','color blind','colour blind']))
      add('Visual access','Use strong contrast, meaningful labels, alt text or verbal description, keyboard and screen-reader checks, and a nonvisual way to receive the same information.');
    if(any(['hearing','deaf','hard of hearing','caption','transcript']))
      add('Hearing access','Provide captions or transcripts, visual instructions, clear turn-taking, and written access to questions and feedback.');
    if(any(['motor','mobility','fine motor','wheelchair','keyboard','mouse']))
      add('Motor and physical access','Provide keyboard-operable or low-motor alternatives, flexible seating and positioning, accessible room routes, and additional time when needed.');
    if(any(['adhd','attention','executive','autism','cognitive','memory','processing','anxiety','break']))
      add('Cognitive and participation access','Use predictable agendas, short task chunks, models, checklists, breaks, quiet participation options, and flexible response formats. Confirm preferences with the student rather than inferring them.');
    if(any(['device','internet','wifi','computer','tablet','phone','technology']))
      add('Device and connectivity access','Keep a paper or offline workflow, allow shared-device use, avoid making home internet a requirement, and download essential materials in advance.');
    if(any(['transport','travel','bus','subway','ride']))
      add('Transportation access','Favor school-based, virtual, or hybrid participation; communicate travel plans early; and provide a remote or asynchronous sharing option when possible.');
    if(any(['schedule','work','job','caregiving','religious','time','after school','afterschool']))
      add('Scheduling access','Use predictable dates, asynchronous options, flexible roles, and advance notice. Separate required team work from optional event participation where possible.');
    if(any(['food','allergy','meal','diet']))
      add('Event food access','Communicate food plans and ingredients in advance, provide an allergy-aware alternative, and ensure participation does not depend on eating provided food.');
    return results;
  }

  function calculateTeams(cfg){
    if(cfg.format === 'One-on-one tutoring') return {count:1, ideal:1, sizeText:'One student supported by one advisor'};
    const ideal = cfg.format === 'Virtual club' || cfg.format === 'Lunch or short-cycle club' ? 4 : 5;
    const count = Math.max(1, Math.ceil(cfg.teamSize / ideal));
    const low = Math.floor(cfg.teamSize / count);
    const high = Math.ceil(cfg.teamSize / count);
    return {count, ideal, sizeText: count === 1 ? `${cfg.teamSize} students in one project team` : `${count} project teams of approximately ${low}–${high} students`};
  }

  function rolePlan(cfg, teams){
    const items = [];
    if(cfg.teamSize === 1){
      items.push('The student rotates through all five roles by phase: Interview and Empathy, Learning Research, Design and Prototype, Testing and Evidence, and Documentation and Presentation.');
      items.push('Use the advisor, teacher-client, another student, or a family or community reviewer as an external feedback partner so the project is not designed in isolation.');
    } else if(cfg.teamSize === 2){
      items.push('Student A begins with Interview/Empathy and Documentation/Presentation; Student B begins with Learning Research, Design/Prototype, and Testing/Evidence. Swap role clusters after the problem-definition stage.');
    } else if(cfg.teamSize === 3){
      items.push('Begin with three role clusters: Interview/Documentation, Learning Research, and Design/Testing. Rotate at the midpoint so every student contributes to research, building, testing, and presentation.');
    } else if(cfg.teamSize === 4){
      items.push('Use four rotating roles and combine Testing/Evidence with Documentation/Presentation. Rotate after prototyping so no student is limited to note-taking or presenting.');
    } else if(cfg.teamSize <= 6 && teams.count === 1){
      items.push('Use the five-role model directly. With six students, pair two students for Testing/Evidence or Documentation/Presentation and rotate the pair after the first test.');
    } else {
      items.push(`Use the five-role model within each of the ${teams.count} project teams. Each team should produce one shared learning tool.`);
      items.push('Schedule cross-team critique at the end of Define, Prototype, and Test so teams learn from one another without merging all projects into one product.');
    }
    if(cfg.grade === 'mixed') items.push('Use cross-age pairs carefully: older students may model processes, but younger students must retain meaningful design, testing, and speaking roles.');
    return items;
  }

  function meetingPattern(cfg){
    const patterns = {
      '45 minutes':'5 minutes check-in; 8–10 minutes mini-lesson or model; 22–25 minutes focused team work; 5–7 minutes critique or documentation; 3 minutes for the next action.',
      '60 minutes':'8–10 minutes check-in and mini-lesson; 35 minutes guided project work; 10 minutes critique, safety, or accessibility check; 5 minutes documentation and next action.',
      '75 minutes':'10–12 minutes mini-lesson; 45 minutes team work; 12 minutes peer or advisor critique; 6–8 minutes documentation and next action.',
      '90 minutes':'15 minutes mini-lesson and model; 50–55 minutes team work; 15 minutes testing or critique; 5–10 minutes documentation and next action.',
      'Half-day intensive':'Opening and team setup; one focused learning block; a long design work block; a break; testing or critique; revision; and a closing reflection. Provide prework for empathy or research.',
      'Full-day intensive':'Use stations for foundation, empathy synthesis, task analysis, research, ideation, prototyping, testing, revision, and demonstration. Require prework and a later follow-up because a single day cannot replace authentic stakeholder access.'
    };
    const frequency = {
      'Once per week':'Use one combined session each week and assign only short, clearly bounded between-session tasks such as scheduling an interview, verifying one source, or revising one artifact.',
      'Twice per week':'Use Meeting A for the lesson, modeling, and planning; use Meeting B for Project Studio work, critique, testing, and documentation.',
      'During class periods':'Use one class period for the lesson and guided practice, a second for project work, and a third or independent block only when needed for interviews, testing, or revision.',
      'Intensive single-day format':'Move orientation, teacher-client input, family communication, and basic research into prework. Use the intensive day for synthesis, prototyping, testing, revision, and demonstration, followed by a short post-event reflection.',
      'Other':'Document the exact cadence, deadline pattern, and between-session expectations before recruiting students.'
    };
    return [patterns[cfg.meeting], frequency[cfg.frequency]].filter(Boolean);
  }

  function contactTime(cfg){
    const weeks = {five:5, six:6, ten:10, semester:16}[cfg.schedule] || 5;
    const minutes = {'45 minutes':45,'60 minutes':60,'75 minutes':75,'90 minutes':90,'Half-day intensive':240,'Full-day intensive':420}[cfg.meeting] || 60;
    const sessionsPerWeek = {'Once per week':1,'Twice per week':2,'During class periods':2,'Intensive single-day format':0,'Other':1}[cfg.frequency];
    if(cfg.frequency === 'Intensive single-day format') return {sessions:1, minutes, text:`approximately ${Math.round(minutes/60*10)/10} contact hours on the intensive day, plus required prework and follow-up`};
    const sessions = weeks * sessionsPerWeek;
    const total = sessions * minutes;
    return {sessions, minutes:total, text:`approximately ${sessions} meetings and ${Math.round(total/60*10)/10} contact hours`};
  }

  function formatRecommendations(cfg, teams, priorities){
    const recs = [];
    switch(cfg.format){
      case 'One-on-one tutoring':
        recs.push('Keep student ownership visible by having the student ask the interview questions, make product decisions, document evidence, and lead the demonstration.');
        recs.push('Add at least two outside perspectives: a teacher-client and a learner, peer, family member, or community reviewer.');
        if(cfg.teamSize !== 1) pushPriority(priorities,'required','Resolve the mismatch between one-on-one format and the number of students.','Select one student, or change the implementation format to a small-group team.');
        break;
      case 'Small-group team':
        recs.push('Use one shared product for each team of four to six students and rotate the five student roles.');
        if(cfg.teamSize > 6) pushPriority(priorities,'strong',`Create ${teams.count} smaller project teams rather than one large team.`,`Groups larger than six make interviews, ownership, building, and presentation roles harder to distribute.`);
        break;
      case 'Classroom integration':
        recs.push(`Create ${teams.count} teams and use common milestones, a shared project notebook structure, and whole-class mini-lessons.`);
        recs.push('Use a teacher-client challenge bank or several teacher-clients so one person is not responsible for reviewing every team at every stage.');
        recs.push('Use gallery walks or cross-team critique after Define, Prototype, and Test.');
        if(cfg.teamSize < 8) pushPriority(priorities,'helpful','Consider whether the small-group format would be simpler.','Classroom integration can work with a small class, but the small-group pathway may require less coordination.');
        break;
      case 'Virtual club':
        recs.push('Use a shared project notebook, accessible agendas, optional camera use, clear turn-taking, breakout rooms, and asynchronous contribution options.');
        recs.push('Keep synchronous meetings focused on discussion, critique, and decisions; move source checking and document revision to bounded asynchronous tasks.');
        if(!hasSupport(cfg,'Devices and internet')) pushPriority(priorities,'required','Confirm devices and reliable internet or change the delivery format.','A virtual club cannot operate equitably without dependable access or an equivalent offline participation pathway.');
        break;
      case 'Lunch or short-cycle club':
        recs.push('Limit the project to one learner, one smallest component, one strategy, one prototype question, and one meaningful revision.');
        recs.push('Prepare materials before meetings; do not spend the limited session time creating accounts or resolving avoidable technology setup.');
        if(['75 minutes','90 minutes','Half-day intensive','Full-day intensive'].includes(cfg.meeting)) pushPriority(priorities,'strong','Align the selected meeting length with a lunch or short-cycle format.','Choose a 45- or 60-minute meeting, or change the implementation format.');
        break;
      case 'Boot camp or showcase day':
        recs.push('Use pre-selected or pre-interviewed teacher-client challenges, pre-approved tools, stations, mentors, and visible time limits.');
        recs.push('Treat the event as one part of a larger learning sequence: complete empathy and basic research before the event and conduct reflection or retesting afterward.');
        if(cfg.frequency !== 'Intensive single-day format') pushPriority(priorities,'helpful','Clarify whether this is a true intensive event or an ongoing club.','The boot-camp format works best with prework, one intensive day, and a short follow-up.');
        if(cfg.client !== 'Identified and available') pushPriority(priorities,'required','Confirm a teacher-client problem before the boot camp.','A one-day event does not provide enough time to recruit a teacher-client and conduct authentic problem discovery during the event.');
        break;
    }
    return recs;
  }

  function gradeRecommendations(cfg, priorities){
    const recs = [];
    if(cfg.grade === 'upper-elementary'){
      recs.push('Use shorter directions, concrete examples, structured interview roles, visible checklists, frequent movement or breaks, and paper-first prototypes.');
      recs.push('Use advisor-managed or school-managed technology access unless current policies explicitly permit independent student accounts.');
      if(['Gem or chatbot building available','Advanced application development available'].includes(cfg.tech)) pushPriority(priorities,'required','Verify age, account, school, and family requirements before students use the selected building platform.','For upper-elementary students, adult-managed demonstrations or paper simulation may be the appropriate alternative.');
      if(['90 minutes','Half-day intensive','Full-day intensive'].includes(cfg.meeting)) recs.push('Break long meetings into short blocks with visible transitions, movement, and more than one participation mode.');
    } else if(cfg.grade === 'middle'){
      recs.push('Use structured templates and role rotation while allowing students to make the core problem, strategy, and product decisions.');
      recs.push('Limit students to a small number of approved platforms and explicitly teach source verification and privacy before independent use.');
    } else if(cfg.grade === 'high'){
      recs.push('Expect students to verify original sources, justify technology choices, document versions, and lead teacher-client and learner testing with advisor approval.');
      recs.push('Advanced technical work should increase the quality of the learning interaction—not merely add features.');
    } else {
      recs.push('Use common learning goals with age-appropriate scaffolds, cross-age critique, and differentiated building tasks.');
      recs.push('Do not allow older students to become the permanent builders or presenters; rotate high-status roles.');
    }
    return recs;
  }

  function experienceRecommendations(cfg, priorities){
    const recs = [];
    if(cfg.experience === 'new'){
      recs.push('Model one complete mini-project before students begin their own work.');
      recs.push('Use one teacher-client challenge, one smallest component, one evidence-supported strategy, and one low-resolution prototype before adding complexity.');
      if(cfg.tech === 'Advanced application development available' && ['five','six'].includes(cfg.schedule)) pushPriority(priorities,'strong','Use a simpler product type or extend the schedule.','Students who are new to design and AI are unlikely to complete authentic empathy, research, testing, and responsible advanced development in five or six weeks.');
    } else if(cfg.experience === 'mixed'){
      recs.push('Pair experienced and newer students for modeling, but rotate roles so expertise does not become permanent control of technology or presentation.');
      recs.push('Establish common vocabulary and require each student to explain the problem, evidence, and testing results.');
    } else {
      recs.push('Require comparison of at least two prototypes or interaction approaches and a stronger retest using comparable tasks.');
      recs.push('Increase rigor through evidence, edge-case testing, accessibility, and educational justification rather than through feature count alone.');
    }
    return recs;
  }

  function adultCapacity(cfg, teams, priorities){
    const cap = {one:2, two:4, 'tech-mentor':3, multiple:6}[cfg.adults] || 2;
    const recs = [];
    if(cfg.adults === 'one') recs.push('Use common checkpoints, peer critique, self-service templates, and a visible help queue so one advisor is not the only source of feedback.');
    if(cfg.adults === 'two') recs.push('Divide responsibilities: one adult facilitates learning and team decisions while the other monitors logistics, accessibility, technology, and testing permissions; rotate when appropriate.');
    if(cfg.adults === 'tech-mentor') recs.push('The advisor retains educational, privacy, and accessibility decisions. The technical mentor supports feasibility, debugging, and version control without selecting the learning solution.');
    if(cfg.adults === 'multiple') recs.push('Assign common adult roles—learning-design facilitator, technology support, accessibility and logistics, and testing or documentation—using one shared rubric and decision process.');
    if(teams.count > cap) pushPriority(priorities,'required','Add adult facilitation, reduce the number of simultaneous teams, or stagger project work.',`${label('adults',cfg.adults)} can reasonably support about ${cap} active project teams with this level of inquiry and testing; the planner estimates ${teams.count}.`);
    if(cfg.adults === 'one' && cfg.teamSize > 12) pushPriority(priorities,'required','Do not run more than two active teams with one advisor without additional support.','Teacher-client coordination, accessibility, testing approval, and technical troubleshooting require adult attention.');
    if(hasSupport(cfg,'Co-advisor or second adult') && cfg.adults === 'one') recs.push('A second adult is listed as an available support; assign that person a clear facilitation or logistics role before the first meeting.');
    return recs;
  }

  function technologyRecommendations(cfg, priorities){
    const recs = [];
    if(cfg.tech === 'Paper and low-tech only'){
      recs.push('Use paper flows, cards, games, organizers, role-play, storyboards, and physical prototypes.');
      recs.push('Keep AI literacy in the curriculum through advisor demonstrations, output evaluation, or comparison activities even when students do not use individual AI accounts.');
    } else if(cfg.tech === 'Approved AI assistant available'){
      recs.push('Use the AI assistant for research questions, candidate examples, critique, and content drafts; require a source and prompt log and verify important claims.');
      recs.push('Do not assume that access to an assistant authorizes students to publish a chatbot or share conversations.');
    } else if(cfg.tech === 'Gem or chatbot building available'){
      recs.push('Use the Project Studio Prompt Builder, require a paper conversation flow first, test answer requests and repeated errors, document versions, and define how support fades.');
      recs.push('Confirm current account, age, school, sharing, retention, and accessibility requirements before building.');
      if(!hasSupport(cfg,'Technical support')) pushPriority(priorities,'strong','Identify a technical support contact or keep the conversational prototype low-resolution.','A Gem or chatbot can be built without a specialist, but troubleshooting and platform changes can consume limited project time.');
    } else if(cfg.tech === 'Advanced application development available'){
      recs.push('Prototype the learning interaction before writing code; use version control, safe test data, human review, and a non-AI fallback.');
      recs.push('Separate educational decisions from technical feasibility and document any AI-generated code or content.');
      if(!hasSupport(cfg,'Technical support')) pushPriority(priorities,'required','Add technical support or select a simpler product type.','Advanced application development without technical support is likely to displace empathy, learning-science research, testing, and revision.');
    } else {
      recs.push('Begin paper-first and set a technology decision deadline before the prototype phase.');
      recs.push('Confirm approved tools, accounts, data practices, sharing, accessibility, devices, and low-tech alternatives.');
      pushPriority(priorities,'required','Confirm the technology level before students enter accounts, upload content, or build a digital prototype.','The team can begin human-learning lessons and empathy work while technology approval is pending.');
    }
    if(cfg.tech !== 'Paper and low-tech only' && cfg.tech !== 'Not yet confirmed' && !hasSupport(cfg,'Devices and internet')) pushPriority(priorities,'required','Confirm equitable device and internet access or change the technology plan.','The selected technology level depends on devices and connectivity that are not listed as available.');
    return recs;
  }

  function stakeholderRecommendations(cfg, priorities){
    const recs = [];
    if(cfg.client === 'Identified and available'){
      recs.push('Schedule the initial interview early, a midpoint concept or prototype review, and a final testing or sharing-event check-in.');
      recs.push('Send a short briefing explaining the teacher-client role: describe the need and evidence, but do not select the student solution.');
    } else if(cfg.client === 'Potential teacher-client identified'){
      recs.push('Assign one adult to confirm availability and schedule the interview by a clear deadline. Prepare one backup teacher-client or challenge.');
      pushPriority(priorities,'strong','Confirm the teacher-client before the team finalizes the problem.','Students may practice interviewing and begin foundation lessons, but they should not lock the product direction without authentic input.');
    } else {
      recs.push('Begin with foundation lessons and interview practice while the advisor recruits a teacher-client. Use a sample case only for practice.');
      pushPriority(priorities,'required','Identify and schedule a teacher-client before students select the final learning problem.','The League begins with an authentic teacher-client need rather than a preselected app idea.');
    }
    if(cfg.family === 'Information sent'){
      recs.push('Review family questions and accommodation requests, then send confirmed interview, testing, and sharing-event updates.');
    } else if(cfg.family === 'Draft prepared'){
      recs.push('Finalize and send the communication before interviews, recordings, testing, or account-based tool use.');
      pushPriority(priorities,'strong','Send the prepared family communication and provide a contact for questions.','Families need time to understand AI use, privacy, accessibility, testing, and event expectations.');
    } else {
      recs.push('Prepare a plain-language family message explaining what students will do, how AI may or may not be used, what information students must not enter, and how families can request support.');
      pushPriority(priorities,'required','Complete family communication before interviews, recordings, learner testing, or public sharing.','The program should not rely on last-minute or event-only family communication.');
    }
    if(!hasSupport(cfg,'Peer learners or testers')) pushPriority(priorities,'strong','Recruit peer learners or identify another approved testing pathway.','Peer critique can begin without learner testing, but evidence of usability and learning requires appropriate users or a clearly stated limitation.');
    if(!hasSupport(cfg,'Family or community reviewers')) recs.push('Family or community reviewers are optional for the build cycle, but they can strengthen feedback on transparency, accessibility, trust, and the sharing event.');
    return recs;
  }

  function accessibilityRecommendations(cfg, priorities){
    const parsed = parseAccessNeeds(cfg.access);
    const recs = [];
    if(!cfg.access || /^(none|n\/a|na|not known|to be determined)/i.test(cfg.access)){
      recs.push('Ask students and families the advisor accessibility questions before finalizing meeting, technology, interview, testing, and sharing-event plans. Do not interpret an empty field as evidence that no support is needed.');
    } else {
      recs.push('Review the stated needs directly with the student or family and confirm preferred supports. The planner only matches explicit words to possible actions; it does not make a diagnosis.');
    }
    parsed.forEach(x => recs.push(`${x.category}: ${x.recommendation}`));
    if(cfg.access && !hasSupport(cfg,'Accessibility support')) pushPriority(priorities,'strong','Identify who will coordinate the stated accessibility or participation needs.','Needs are listed, but accessibility support is not marked as available.');
    if(parsed.some(x => x.category === 'Language access') && !hasSupport(cfg,'Translation or interpretation')) pushPriority(priorities,'strong','Confirm translation or interpretation support.','The stated needs include language access, but translation or interpretation is not listed as available.');
    if(parsed.some(x => x.category === 'Transportation access') && ['school','community'].includes(cfg.event) && !hasSupport(cfg,'Transportation or event support')) pushPriority(priorities,'strong','Address transportation or provide a virtual or school-based alternative for the sharing event.','Transportation needs are stated and the selected event is in person.');
    return recs;
  }

  function eventRecommendations(cfg, priorities){
    const recs = [];
    if(cfg.event === 'school'){
      recs.push('Reserve an accessible room and demonstration area, confirm power and internet, plan an arrival and setup window, and prepare a non-live backup such as screenshots, a video, or a paper role-play.');
      recs.push('Use short presentation rotations or stations when several teams are presenting.');
    } else if(cfg.event === 'virtual'){
      recs.push('Use an accessible platform, captions or transcripts, clear turn-taking, a test run, approved links, and a backup recording, screenshots, or paper walkthrough.');
      if(!hasSupport(cfg,'Devices and internet')) pushPriority(priorities,'required','Confirm devices and internet for presenters and intended audience or select another sharing-event format.','The selected virtual event depends on connectivity that is not listed as available.');
    } else if(cfg.event === 'community'){
      recs.push('Use plain-language explanations, family-friendly scheduling, interpretation when needed, accessible room and seating, clear privacy and media expectations, and time for community questions.');
      if(cfg.family !== 'Information sent') pushPriority(priorities,'required','Send family communication before confirming a family or community sharing event.','Families need advance information about purpose, attendance, access, transportation, food, media, and participation.');
    } else {
      recs.push('Decide whether the sharing event will be school-based, virtual, or family/community-facing by the midpoint of the cycle.');
      if(cfg.schedule === 'five') pushPriority(priorities,'strong','Choose the sharing-event format by the end of Week 2.','A five-week cycle leaves little time to arrange access, demonstrations, permissions, and audience communication.');
    }
    if(!hasSupport(cfg,'Transportation or event support') && ['school','community'].includes(cfg.event)) recs.push('Confirm whether event transportation, setup, interpretation, food, or accessibility support is needed; these are not currently listed as available.');
    return recs;
  }

  function calendarDelivery(cfg, item){
    const notes = [];
    if(cfg.frequency === 'Twice per week') notes.push('Meeting A: mini-lesson, model, and planning. Meeting B: Project Studio work, critique, or testing.');
    else if(cfg.frequency === 'During class periods') notes.push('Use at least one class for instruction and one for project work; schedule interviews or testing in a separate approved block.');
    else if(cfg.frequency === 'Once per week') notes.push('Combine instruction and project work in one meeting and assign only a small between-meeting action.');
    else if(cfg.frequency === 'Intensive single-day format') notes.push('Place this phase in prework, a timed event station, or follow-up; do not attempt the entire phase through lecture during the event.');
    else notes.push('Assign a clear date, duration, and between-session expectation for this phase.');
    if(cfg.meeting === '45 minutes') notes.push('Keep the artifact small and continue unfinished research, scheduling, or documentation between meetings.');
    if(['75 minutes','90 minutes'].includes(cfg.meeting)) notes.push('Reserve time for peer critique or a formative accessibility and safety check.');
    if(['Half-day intensive','Full-day intensive'].includes(cfg.meeting)) notes.push('Use breaks, stations, visible time limits, and a written artifact handoff between blocks.');
    return notes.join(' ');
  }

  function combinationRules(cfg, teams, priorities, assumptions){
    if(cfg.schedule === 'five' && cfg.meeting === '45 minutes' && cfg.frequency === 'Once per week')
      pushPriority(priorities,'strong','Extend to six or ten weeks, meet twice weekly, or reduce the project scope.','Five 45-minute meetings provide very little time for authentic interviews, research, testing, revision, and sharing-event preparation.');
    if(cfg.schedule === 'five' && cfg.experience === 'new')
      pushPriority(priorities,'helpful','Use one teacher-client, one smallest component, one product direction, and one main testing question.','A compressed cycle works best when students are new and the scope is deliberately narrow.');
    if(cfg.schedule === 'five' && cfg.teamSize > 12)
      pushPriority(priorities,'strong','Use a ten-week or semester schedule, reduce the number of teams, or add adults.','A large group needs more time for team facilitation, teacher-client access, critique, testing, and presentation rehearsal.');
    if(cfg.schedule === 'semester' && cfg.frequency === 'Intensive single-day format')
      pushPriority(priorities,'required','Choose a recurring frequency or change the schedule to a boot-camp sequence.','A semester learning cycle cannot be delivered as one intensive day.');
    if(cfg.format !== 'Boot camp or showcase day' && cfg.frequency === 'Intensive single-day format')
      pushPriority(priorities,'strong','Change the implementation format to Boot camp or add recurring meetings.','A single intensive day requires prework and follow-up and does not match the selected ongoing format.');
    if(cfg.format === 'Virtual club' && cfg.grade === 'upper-elementary')
      pushPriority(priorities,'strong','Use shorter synchronous blocks and confirm adult-supported technology access.','Upper-elementary virtual participation benefits from predictable routines, paper or offline options, and family awareness of account and scheduling needs.');
    if(cfg.tech === 'Advanced application development available' && ['five','six'].includes(cfg.schedule) && cfg.experience !== 'experienced')
      pushPriority(priorities,'strong','Move to a ten-week or semester cycle or prototype without full application development.','Advanced development can otherwise displace empathy, task analysis, research, and testing.');
    if(['Half-day intensive','Full-day intensive'].includes(cfg.meeting) && ['Once per week','Twice per week','During class periods'].includes(cfg.frequency))
      addUnique(assumptions,'Confirm that the long meeting duration is intended to recur at the selected frequency; the estimated contact time may be much larger than needed.');
    if(cfg.frequency === 'Other') addUnique(assumptions,'Specify the actual meeting cadence, deadlines, and between-session expectations.');
    if(cfg.client !== 'Identified and available') addUnique(assumptions,'The plan assumes the final problem and product decision will wait until authentic teacher-client input is obtained.');
    if(cfg.event === 'undetermined') addUnique(assumptions,'The sharing-event format, audience, location, access, and permissions still need to be decided.');
    if(cfg.tech === 'Not yet confirmed') addUnique(assumptions,'The plan assumes paper-first work until an approved technology decision is made.');
    if(!hasSupport(cfg,'Meeting space') && !['Virtual club'].includes(cfg.format)) pushPriority(priorities,'required','Confirm an accessible meeting space or change to a virtual or hybrid format.','The selected format is not virtual and meeting space is not listed as available.');
    if(!hasSupport(cfg,'Paper prototyping materials')) pushPriority(priorities,'strong','Prepare basic low-resolution prototyping materials.','Paper, cards, sticky notes, markers, and simple mockups remain useful even for advanced digital projects.');
    if(!hasSupport(cfg,'Protected project work time') && ['five','six'].includes(cfg.schedule)) pushPriority(priorities,'strong','Protect project work time inside or between meetings.','Compressed cycles require reliable time for interviews, research, prototyping, and revision.');
  }

  function buildPlan(raw){
    const cfg = normalize(raw);
    const priorities = [];
    const assumptions = [];
    const teams = calculateTeams(cfg);
    const contact = contactTime(cfg);

    const formatRecs = formatRecommendations(cfg, teams, priorities);
    const gradeRecs = gradeRecommendations(cfg, priorities);
    const experienceRecs = experienceRecommendations(cfg, priorities);
    const adultRecs = adultCapacity(cfg, teams, priorities);
    const techRecs = technologyRecommendations(cfg, priorities);
    const stakeholderRecs = stakeholderRecommendations(cfg, priorities);
    const accessRecs = accessibilityRecommendations(cfg, priorities);
    const eventRecs = eventRecommendations(cfg, priorities);
    combinationRules(cfg, teams, priorities, assumptions);

    const beforeStart = [
      'Confirm the advisor or adult team, implementation schedule, meeting space or virtual platform, and protected project work time.',
      'Review school permissions, current platform requirements, privacy and data practices, acceptable use, sharing settings, and low-tech alternatives.',
      'Prepare family communication and a clear way to request accessibility, language, device, transportation, or scheduling support.',
      cfg.client === 'Identified and available' ? 'Schedule the teacher-client interview and midpoint review.' : 'Recruit and schedule a teacher-client; use sample cases only for interview practice.',
      'Prepare the project notebook, interview materials, low-resolution prototyping materials, and a plan for saving or downloading Project Studio work.',
      'Identify peer learners, teacher-client reviewers, or another approved testing pathway and define permission and stopping procedures.'
    ];

    const firstMeeting = [
      'Explain that every project includes AI literacy and critical evaluation of AI, even when the strongest final tool is non-AI.',
      'Introduce the full iterative cycle: Understand, Listen, Diagnose, Research, Imagine, Build, Test, Improve, and Share.',
      `Organize students as ${teams.sizeText.toLowerCase()} and explain the rotating five-role model.`,
      'Establish team agreements for respectful critique, privacy, source verification, documentation, accessibility, and shared ownership.',
      'Complete a short human-versus-machine reasoning activity and introduce productive struggle, metacognition, self-regulation, and transfer.',
      'Schedule empathy-interview practice and identify the next readiness action.'
    ];

    const calendar = SCHEDULES[cfg.schedule].map(item => ({...item, delivery:calendarDelivery(cfg,item)}));
    const required = priorities.filter(x => x.level === 'required').length;
    const strong = priorities.filter(x => x.level === 'strong').length;
    const status = required ? {
      level:'blocked', label:'Setup required',
      title:'Complete key setup before interviews, tool-building, learner testing, or public sharing.',
      summary:`The planner identified ${required} required action${required===1?'':'s'} and ${strong} strong recommendation${strong===1?'':'s'}. Foundation lessons and interview practice may begin while setup is completed.`
    } : strong ? {
      level:'adjust', label:'Ready with adjustments',
      title:'The plan is workable after several recommended adjustments.',
      summary:`The planner identified ${strong} strong recommendation${strong===1?'':'s'} but no launch-blocking conflict. Review the priorities before recruiting or scheduling external participants.`
    } : {
      level:'ready', label:'Ready to begin',
      title:'The current selections support a feasible starting plan.',
      summary:'Continue to verify school requirements, participant preferences, and current technology policies; the planner does not replace local review.'
    };

    const priorityOrder = {required:0, strong:1, helpful:2};
    const sortedPriorities = priorities.sort((a,b) => priorityOrder[a.level] - priorityOrder[b.level]);

    return {
      cfg, status, teams, contact,
      rolePlan:rolePlan(cfg,teams),
      meetingPattern:meetingPattern(cfg),
      formatRecs, gradeRecs, experienceRecs, adultRecs,
      techRecs, stakeholderRecs, accessRecs, eventRecs,
      beforeStart, firstMeeting, calendar,
      priorities:sortedPriorities,
      assumptions,
      supports:cfg.supports.length ? cfg.supports : ['No supports selected']
    };
  }

  function esc(value){
    return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function listHtml(items){ return `<ul class="check-list">${items.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`; }
  function sectionHtml(title, items, note){
    return `<section class="plan-section"><h3>${esc(title)}</h3>${note?`<p class="plan-note">${esc(note)}</p>`:''}${listHtml(items)}</section>`;
  }

  function toHtml(plan){
    const c = plan.cfg;
    const config = [
      ['Students',c.teamSize],['Grade band',label('grade',c.grade)],['Experience',label('experience',c.experience)],
      ['Format',c.format],['Schedule',label('schedule',c.schedule)],['Meetings',`${c.meeting}; ${c.frequency}`],
      ['Adult support',label('adults',c.adults)],['Teacher-client',c.client],['Technology',c.tech],
      ['Family communication',c.family],['Sharing event',label('event',c.event)],['Estimated contact time',plan.contact.text]
    ].map(([k,v])=>`<div><strong>${esc(k)}</strong>${esc(v)}</div>`).join('');

    const calendar = plan.calendar.map(item => `<article class="plan-calendar-item"><h4>${esc(item.label)} — ${esc(item.focus)}</h4><p>${esc(item.activities)}</p><p><strong>Artifact:</strong> ${esc(item.artifact)}</p><p><strong>Advisor checkpoint:</strong> ${esc(item.checkpoint)}</p><p class="plan-calendar-meta"><strong>Delivery adjustment:</strong> ${esc(item.delivery)}</p></article>`).join('');
    const priorities = plan.priorities.length ? plan.priorities.map(p=>`<div class="plan-priority ${esc(p.level)}"><strong>${p.level==='required'?'Required before the relevant activity':p.level==='strong'?'Strong recommendation':'Planning enhancement'}: ${esc(p.text)}</strong><span>${esc(p.reason)}</span></div>`).join('') : '<p class="plan-empty">No configuration conflict was identified. Continue local review and participant consultation.</p>';
    const assumptions = plan.assumptions.length ? listHtml(plan.assumptions) : '<p class="plan-empty">No additional assumptions were generated.</p>';

    return `
      <section class="plan-status-card ${esc(plan.status.level)}"><span class="plan-status-label">${esc(plan.status.label)}</span><h3>${esc(plan.status.title)}</h3><p>${esc(plan.status.summary)}</p></section>
      <section class="plan-section"><h3>Your configuration</h3><div class="plan-config">${config}</div><h4>Available supports</h4>${listHtml(plan.supports)}${c.access?`<h4>Stated access or logistics needs</h4><p>${esc(c.access)}</p>`:''}</section>
      <section class="plan-section"><h3>Recommended team and role structure</h3><p class="plan-note">${esc(plan.teams.sizeText)}.</p>${listHtml(plan.rolePlan)}</section>
      <section class="plan-section"><h3>Recommended meeting design</h3>${listHtml(plan.meetingPattern)}<h4>Format-specific recommendations</h4>${listHtml(plan.formatRecs)}<h4>Grade-band recommendations</h4>${listHtml(plan.gradeRecs)}<h4>Experience-level recommendations</h4>${listHtml(plan.experienceRecs)}<h4>Adult facilitation recommendations</h4>${listHtml(plan.adultRecs)}</section>
      ${sectionHtml('Before students begin',plan.beforeStart)}
      ${sectionHtml('First meeting',plan.firstMeeting)}
      <section class="plan-section"><h3>Adapted calendar</h3><p class="plan-note">The selected ${esc(label('schedule',c.schedule).toLowerCase())} provides ${esc(plan.contact.text)}. The delivery notes adapt each phase to the selected meeting length and frequency.</p><div class="plan-calendar">${calendar}</div></section>
      ${sectionHtml('Technology and product recommendations',plan.techRecs)}
      ${sectionHtml('Teacher-client, family, and testing recommendations',plan.stakeholderRecs)}
      ${sectionHtml('Accessibility and participation recommendations',plan.accessRecs,'Review all recommendations with the person requesting support. The planner responds only to words entered and does not make a diagnosis.')}
      ${sectionHtml('Sharing-event recommendations',plan.eventRecs)}
      <section class="plan-section"><h3>Priority actions</h3><div class="plan-priority-list">${priorities}</div></section>
      <section class="plan-section"><h3>Assumptions to confirm</h3>${assumptions}</section>`;
  }

  function heading(title, lines){ return `${title}\n${lines.map(x=>`- ${x}`).join('\n')}`; }
  function toText(plan){
    const c = plan.cfg;
    const calendar = plan.calendar.map((item,i)=>`${i+1}. ${item.label} — ${item.focus}\n   Activities: ${item.activities}\n   Artifact: ${item.artifact}\n   Advisor checkpoint: ${item.checkpoint}\n   Delivery adjustment: ${item.delivery}`).join('\n\n');
    const priorities = plan.priorities.length ? plan.priorities.map((p,i)=>`${i+1}. [${p.level.toUpperCase()}] ${p.text}\n   Why: ${p.reason}`).join('\n') : 'No configuration conflict identified; continue local review.';
    return `STUDENT AI LEARNING INNOVATION LEAGUE — ADAPTIVE CLUB PLAN\n\nPLAN STATUS\n${plan.status.label}: ${plan.status.title}\n${plan.status.summary}\n\nCONFIGURATION\n- Students: ${c.teamSize}\n- Grade band: ${label('grade',c.grade)}\n- Experience: ${label('experience',c.experience)}\n- Format: ${c.format}\n- Schedule: ${label('schedule',c.schedule)}\n- Meeting length: ${c.meeting}\n- Frequency: ${c.frequency}\n- Adult support: ${label('adults',c.adults)}\n- Teacher-client: ${c.client}\n- Technology: ${c.tech}\n- Family communication: ${c.family}\n- Sharing event: ${label('event',c.event)}\n- Estimated contact time: ${plan.contact.text}\n- Available supports: ${plan.supports.join(', ')}\n- Stated access or logistics needs: ${c.access || 'To be determined with students and families'}\n\n${heading('TEAM AND ROLE STRUCTURE',[plan.teams.sizeText,...plan.rolePlan])}\n\n${heading('MEETING DESIGN',plan.meetingPattern)}\n\n${heading('FORMAT RECOMMENDATIONS',plan.formatRecs)}\n\n${heading('GRADE-BAND RECOMMENDATIONS',plan.gradeRecs)}\n\n${heading('EXPERIENCE RECOMMENDATIONS',plan.experienceRecs)}\n\n${heading('ADULT FACILITATION',plan.adultRecs)}\n\n${heading('BEFORE STUDENTS BEGIN',plan.beforeStart)}\n\n${heading('FIRST MEETING',plan.firstMeeting)}\n\nADAPTED CALENDAR\n${calendar}\n\n${heading('TECHNOLOGY AND PRODUCT RECOMMENDATIONS',plan.techRecs)}\n\n${heading('TEACHER-CLIENT, FAMILY, AND TESTING RECOMMENDATIONS',plan.stakeholderRecs)}\n\n${heading('ACCESSIBILITY AND PARTICIPATION RECOMMENDATIONS',plan.accessRecs)}\n\n${heading('SHARING-EVENT RECOMMENDATIONS',plan.eventRecs)}\n\nPRIORITY ACTIONS\n${priorities}\n\n${heading('ASSUMPTIONS TO CONFIRM',plan.assumptions.length?plan.assumptions:['No additional assumptions generated.'])}\n\nPLANNER NOTE\nThis plan was generated by a deterministic rule system in the browser. It does not use generative AI or save entries. Review the recommendations with students, families, teacher-clients, school leaders, and accessibility staff as appropriate.`;
  }

  function readForm(form){
    const value = id => document.getElementById(id)?.value?.trim() || '';
    return {
      teamSize:value('plan-team-size'), grade:value('plan-grade'), experience:value('plan-experience'),
      format:value('plan-format'), schedule:value('plan-schedule'), meeting:value('plan-meeting'),
      frequency:value('plan-frequency'), adults:value('plan-adults'), client:value('plan-client'),
      tech:value('plan-tech'), family:value('plan-family'), event:value('plan-event'), access:value('plan-access'),
      supports:[...form.querySelectorAll('input[name=plan-support]:checked')].map(x=>x.value)
    };
  }

  function download(name, text){
    const blob = new Blob([text], {type:'text/plain;charset=utf-8'});
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  function init(){
    const form = document.getElementById('club-plan-form');
    if(!form || form.dataset.adaptivePlannerReady === 'true') return;
    form.dataset.adaptivePlannerReady = 'true';
    const output = document.getElementById('club-plan-output');
    const status = document.getElementById('club-plan-status');
    let currentText = '';

    function generate(){
      const plan = buildPlan(readForm(form));
      currentText = toText(plan);
      output.innerHTML = toHtml(plan);
      status.textContent = `${plan.status.label}. Detailed recommendations generated from all selected fields and their combinations.`;
      output.scrollIntoView({behavior:'smooth',block:'start'});
      return plan;
    }

    document.getElementById('generate-club-plan')?.addEventListener('click', generate);
    document.getElementById('copy-club-plan')?.addEventListener('click', async () => {
      if(!currentText) generate();
      try { await navigator.clipboard.writeText(currentText); status.textContent = 'Plan copied.'; }
      catch(e){ status.textContent = 'Select and copy the generated plan manually.'; }
    });
    document.getElementById('download-club-plan')?.addEventListener('click', () => {
      if(!currentText) generate();
      download('learning-league-adaptive-club-plan.txt', currentText);
      status.textContent = 'Plan downloaded.';
    });
    document.getElementById('reset-club-plan')?.addEventListener('click', () => {
      form.reset(); currentText = '';
      output.innerHTML = '<p class="generated-plan-placeholder">Complete the planner and select “Generate plan.”</p>';
      status.textContent = 'Planner reset.';
    });
  }

  return {normalize, parseAccessNeeds, calculateTeams, buildPlan, toHtml, toText, init};
});
