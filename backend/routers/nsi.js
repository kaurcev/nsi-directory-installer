const express = require('express');
const axios = require('axios');
const router = express.Router();

const NSI_BASE_URL = 'https://nsi.rosminzdrav.ru/port/rest';
const DEFAULT_TIMEOUT = 30000;

const cleanHtmlContent = (html) => {
  if (!html) return null;

  return html
    .replace(/(<br\s*\/?>|<\/div>|<\/li>)/gi, '\n')
    .replace(/<\/p>|<\/h\d>/gi, '\n\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(nbsp|amp|lt|gt|quot|apos);/g, (_, entity) =>
      ({ nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }[entity])
    )
    .replace(/\r\n|\n{3,}|[ \t]{2,}/g, (match) =>
      match.includes('\n') ? '\n\n' : ' '
    )
    .trim();
};

const createNsiHandler = (config) => async (req, res) => {
  try {
    const {
      endpoint,
      allowedParams = [],
      fixedParams = {},
      transformResponse = (data) => ({ data }),
      message = ''
    } = config;

    const params = {
      userKey: process.env.NSI_KEY,
      ...fixedParams
    };

    allowedParams.forEach(param => {
      if (req.query[param] !== undefined) {
        params[param] = req.query[param];
      }
    });

    const response = await axios.get(`${NSI_BASE_URL}${endpoint}`, {
      params,
      timeout: DEFAULT_TIMEOUT
    });

    const responseData = transformResponse(response.data, req);
    const statusCode = response.status || 200;
    const responseMessage = typeof message === 'function'
      ? message(req)
      : message;

    res.status(statusCode).json({
      status: true,
      message: responseMessage,
      ...responseData
    });

  } catch (error) {
    const status = error.response?.status || 500;
    const errorMessage = error.response?.data?.message || error.message;

    res.status(status).json({
      status: false,
      message: errorMessage,
      data: null
    });
  }
};

router.get('/search', createNsiHandler({
  endpoint: '/searchDictionary',
  allowedParams: [
    'identifier', 'sorting', 'sortingDirection', 'showArchive',
    'publishDateFrom', 'publishDateTo', 'name', 'description', 'law',
    'respOrganizationId', 'typeId', 'groupId'
  ],
  fixedParams: { page: 1, size: 1000 },
  message: 'Результаты поиска',
  transformResponse: (data) => ({
    total: data.total,
    data: data.list.map(item => ({
      id: item.nsiDictionaryId,
      oid: item.oid,
      version: item.version,
      rowsCount: item.rowsCount,
      createDate: item.createDate,
      publishDate: item.publishDate,
      lastUpdate: item.lastUpdate,
      fullName: cleanHtmlContent(item.fullName),
      shortName: cleanHtmlContent(item.shortName),
      description: cleanHtmlContent(item.description),
      structureNotes: cleanHtmlContent(item.structureNotes),
      archive: item.archive,
      groupId: item.groupId,
      typeId: item.typeId,
      respOrganizationId: item.respOrganizationId,
      authOrganizationId: item.authOrganizationId,
    }))
  })
}));

router.get('/passport', createNsiHandler({
  endpoint: '/passport',
  allowedParams: ['identifier', 'version'],
  message: 'Паспорт справочника',
  transformResponse: (data) => ({
    data: {
      id: data.nsiDictionaryId,
      identifier: data.identifier,
      oid: data.oid,
      version: data.version,
      rowsCount: data.rowsCount,
      createDate: data.createDate,
      publishDate: data.publishDate,
      lastUpdate: data.lastUpdate,
      fullName: cleanHtmlContent(data.fullName),
      shortName: cleanHtmlContent(data.shortName),
      description: cleanHtmlContent(data.description),
      structureNotes: cleanHtmlContent(data.structureNotes),
      releaseNotes: cleanHtmlContent(data.releaseNotes),
      respOrganizationId: data.respOrganizationId,
      authOrganizationId: data.authOrganizationId,
      typeId: data.typeId,
      groupId: data.groupId,
      approveDate: data.approveDate,
      fields: data.fields,
      archive: data.archive
    }
  })
}));

router.get('/data', createNsiHandler({
  endpoint: '/data',
  allowedParams: [
    'identifier', 'version', 'page', 'size',
    'columns', 'sorting', 'sortingDirection', 'filters'
  ],
  message: (req) => `Содержимое справочника ${req.query.identifier}`,
  transformResponse: (data) => ({
    total: data.total,
    data: data.list
  })
}));

router.get('/versions', createNsiHandler({
  endpoint: '/versions',
  allowedParams: ['identifier', 'version', 'page', 'size'],
  message: (req) => `Версии справочника ${req.query.identifier}`,
  transformResponse: (data) => ({
    total: data.total,
    data: data.list.map(item => ({
      version: item.version,
      createDate: item.createDate,
      publishDate: item.publishDate,
      lastUpdate: item.lastUpdate,
      releaseNotes: cleanHtmlContent(item.releaseNotes),
      archive: item.archive,
    }))
  })
}));

router.get('/compare', createNsiHandler({
  endpoint: '/compare',
  allowedParams: ['identifier', 'date1', 'date2', 'page', 'size'],
  message: (req) => `Изменения справочника ${req.query.identifier}`,
  transformResponse: (data) => ({
    total: data.data.total,
    data: data.data.list
  })
}));

const resourceHandlers = [
  { path: '/groups', name: 'Группы', endpoint: '/groups' },
  { path: '/types', name: 'Типы', endpoint: '/types' },
  { path: '/responsibleOrganizations', name: 'Ответственные организации', endpoint: '/responsibleOrganizations' },
  { path: '/authOrganizations', name: 'Уполномоченные организации', endpoint: '/authOrganizations' }
];

resourceHandlers.forEach(({ path, name, endpoint }) => {
  router.get(path, createNsiHandler({
    endpoint,
    message: name,
    transformResponse: (data) => ({ data: data.list })
  }));
});

module.exports = router;