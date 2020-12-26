const SmExamQuestion = {
  category: 'Modules',
  type: 'Exam',
  title: 'SmExamQuestion',
  subtitle: '题库管理',
  demos: [
    {
      path: 'sm-exam-question',
      component: () => import('@/components/sm-exam/sm-exam-question/demo/index.vue'),
    },
    {
      path: 'sm-exam-question-cn',
      component: () => import('@/components/sm-exam/sm-exam-question/demo/index.vue'),
    },
  ],
};
const SmExamKnowledgePoints = {
  category: 'Modules',
  type: 'Exam',
  title: 'SmExamKnowledgePoints',
  subtitle: '知识点管理',
  demos: [
    {
      path: 'sm-exam-knowledge-points',
      component: () => import('@/components/sm-exam/sm-exam-knowledge-points/demo/index.vue'),
    },
    {
      path: 'sm-exam-knowledge-points-cn',
      component: () => import('@/components/sm-exam/sm-exam-knowledge-points/demo/index.vue'),
    },
  ],
};
const SmExamExamPaperTemplate = {
  category: 'Modules',
  type: 'Exam',
  title: 'SmExamExamPaperTemplate',
  subtitle: '试卷模板管理',
  demos: [
    {
      path: 'sm-exam-exam-paper-template',
      component: () => import('@/components/sm-exam/sm-exam-exam-paper-template/demo/index.vue'),
    },
    {
      path: 'sm-exam-exam-paper-template-cn',
      component: () => import('@/components/sm-exam/sm-exam-exam-paper-template/demo/index.vue'),
    },
  ],
};
const SmExamPapers = {
  category: 'Modules',
  type: 'Exam',
  title: 'SmExamPapers',
  subtitle: '试卷管理',
  demos: [
    {
      path: 'sm-exam-papers',
      component: () => import('@/components/sm-exam/sm-exam-papers/demo/index.vue'),
    },
    {
      path: 'sm-exam-papers-cn',
      component: () => import('@/components/sm-exam/sm-exam-papers/demo/index.vue'),
    },
  ],
};
const SmExamCategories = {
  category: 'Modules',
  type: 'Exam',
  title: 'SmExamCategories',
  subtitle: '分类管理',
  demos: [
    {
      path: 'sm-exam-categories',
      component: () => import('@/components/sm-exam/sm-exam-categories/demo/index.vue'),
    },
    {
      path: 'sm-exam-categories-cn',
      component: () => import('@/components/sm-exam/sm-exam-categories/demo/index.vue'),
    },
  ],
};
//   SmExamCategories: {
//   },
// };
export const modules = {
  SmExamQuestion,
  SmExamKnowledgePoints,
  SmExamExamPaperTemplate,
  SmExamPapers,
  SmExamCategories,
};
export const demo = [
  ...SmExamQuestion.demos,
  ...SmExamKnowledgePoints.demos,
  ...SmExamExamPaperTemplate.demos,
  ...SmExamPapers.demos,
  ...SmExamCategories.demos,
];