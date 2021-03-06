import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import PublicationService from '../../services/PublicationService';
import * as StatusCode from '../../util/StatusCode';

const PUBLICATIONS_PATH = process.env.PUBLIC_URL + '/meinHaus/publications-management';

it('gets publications', async () => {
	var mock = new MockAdapter(axios);
	mock.onGet(PUBLICATIONS_PATH + '/publications').reply(200, {
		publications: ['pub1', 'pub2', 'pub3'],
	});

	let queryParameters = {
		operation: 'FSale',
	};

	const publications = await PublicationService.getPublications(queryParameters);
	expect(publications.data.publications).toEqual(['pub1', 'pub2', 'pub3']);
});

it('gets publication', async () => {
	var mock = new MockAdapter(axios);
	mock.onGet(PUBLICATIONS_PATH + '/publications/5').reply(200, {
		publication: ['testPublication'],
	});

	const publication = await PublicationService.getPublication(5);
	expect(publication.data.publication).toEqual(['testPublication']);
});

it('gets image', async () => {
	var mock = new MockAdapter(axios);
	mock.onGet(PUBLICATIONS_PATH + '/publications/5/images').reply(200, {
		results: ['try.jpg'],
	});

	const image = await PublicationService.getImage(5, 0);
	expect(image.data.results).toEqual(['try.jpg']);
});

it('posts image', async () => {
	var mock = new MockAdapter(axios);
	mock.onPost(PUBLICATIONS_PATH + '/publications/5/images').reply(StatusCode.OK);

	const publication = await PublicationService.postImages(5, 0);
	expect(publication.status).toEqual(StatusCode.OK);
});
