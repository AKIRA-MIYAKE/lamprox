import * as assert from 'power-assert';
import * as sinon from 'sinon';

import { prepareLambdaFunction, createLambdaFunction, lamprox } from '../src';

describe('lamprox', () => {

  describe('prepareLambdaFunction()', () => {
    type Environments = { fizz: string, bazz: number };

    it('Should return prepared function.', () => {
      const prepared = prepareLambdaFunction<null, string, Environments>(undefined, { fizz: 'test', bazz: 42 });

      const lf = prepared((ambience, promise) => {
        assert.equal(ambience.environments.fizz, 'test');
        assert.equal(ambience.environments.bazz, 42);
        promise.success('This is a main process.');
      });

      const lfc = sinon.spy();

      lf(null, null, lfc);

      assert.ok(lfc.calledOnce);
      assert.equal(lfc.args[0][1].statusCode, 200);
      assert.equal(lfc.args[0][1].body, 'This is a main process.');
    });

    it('Should return prepared function with async process.', () => {
      const prepared = prepareLambdaFunction<null, string, Environments>(undefined, { fizz: 'test', bazz: 42 });

      const lf = prepared((ambience, promise) => {
        setTimeout(() => {
          assert.equal(ambience.environments.fizz, 'test');
          assert.equal(ambience.environments.bazz, 42);
          promise.success('This is a main process.');
        }, 1000);
      });

      const lfc = sinon.spy();

      return new Promise((resolve, reject) => {
        lf(null, null, lfc);
        setTimeout(() => { resolve(); }, 1500);
      })
      .then(() => {
        assert.ok(lfc.calledOnce);
        assert.equal(lfc.args[0][1].statusCode, 200);
        assert.equal(lfc.args[0][1].body, 'This is a main process.');
      });
    });

    it('Should return prepared function when set before process.', () => {
      const prepared = prepareLambdaFunction<number, string, Environments>({
        before: ((ambience, promise) => {
          ambience.environments.fizz = 'answer';
          promise.success(10);
        })
      }, { fizz: 'test', bazz: 42 });

      const lf = prepared((ambience, promise) => {
        assert.equal(ambience.environments.fizz, 'answer');
        promise.success(`Before result is ${ambience.result}.`);
      });

      const lfc = sinon.spy();

      lf(null, null, lfc);

      assert.ok(lfc.calledOnce);
      assert.equal(lfc.args[0][1].body, 'Before result is 10.');
    });

    it('Should return prepared function when set onSucces process.', () => {
      const prepared = prepareLambdaFunction<null, { [key: string]: any }, null>({
        onSuccess: ((ambience, promise) => {
          promise.success({
            statusCode: 200,
            headers: {
              'Test': 'test'
            },
            body: JSON.stringify(ambience.result)
          });
        })
      });

      const lf = prepared((ambience, promise) => {
        promise.success({ test: 'This is a test.' });
      });

      const lfc = sinon.spy();

      lf(null, null, lfc);

      assert.ok(lfc.calledOnce);
      assert.equal(lfc.args[0][1].headers.Test, 'test');
      assert.equal(JSON.parse(lfc.args[0][1].body).test, 'This is a test.');
    });


    it('Should return prepared function when set after process.', () => {
      const prepared = prepareLambdaFunction<null, { [key: string]: any }, null>({
        after: ((ambience, promise) => {
          const resultBody = JSON.parse(ambience.result.body);
          const afterBody = Object.assign({}, resultBody, { after: 42 });

          promise.success({
            statusCode: ambience.result.statusCode,
            headers: ambience.result.headers,
            body: JSON.stringify(afterBody)
          });
        })
      });

      const lf = prepared((ambience, promise) => {
        promise.success({ test: 'This is a test.' });
      });

      const lfc = sinon.spy();

      lf(null, null, lfc);

      assert.ok(lfc.calledOnce);
      assert.equal(JSON.parse(lfc.args[0][1].body).test, 'This is a test.');
      assert.equal(JSON.parse(lfc.args[0][1].body).after, 42);
    });

    it('Should call default onFailure process when main process fail.', () => {
      const prepared = prepareLambdaFunction<null, string, null>();

      const lf = prepared((ambience, promise) => {
        promise.failure(new Error('This is error.'));
      });

      const lfc = sinon.spy();

      lf(null, null, lfc);

      assert.ok(lfc.calledOnce);
      assert.equal(lfc.args[0][1].statusCode, 500);
      assert.equal(lfc.args[0][1].body, 'This is error.');
    });

    it('Should call default onFailure process when before process fail.', () => {
      const prepared = prepareLambdaFunction<null, string, null>({
        before: ((ambience, promise) => {
          promise.failure(new Error('This is error.'));
        })
      });

      const lf = prepared((ambience, promise) => {
        promise.success('This is a test.');
      });

      const lfc = sinon.spy();

      lf(null, null, lfc);

      assert.ok(lfc.calledOnce);
      assert.equal(lfc.args[0][1].statusCode, 500);
      assert.equal(lfc.args[0][1].body, 'This is error.');
    });

    it('Should call option onFailure process when main process fail.', () => {
      const prepared = prepareLambdaFunction<null, string, null>({
        onFailure: ((ambience, promise) => {
          const errorMessage = ambience.result.message;

          promise.success({
            statusCode: 404,
            headers: {},
            body: JSON.stringify({
              test: 'test',
              message: errorMessage
            })
          });
        })
      });

      const lf = prepared((ambience, promise) => {
        promise.failure(new Error('This is error.'));
      });

      const lfc = sinon.spy();

      lf(null, null, lfc);

      assert.ok(lfc.calledOnce);
      assert.equal(lfc.args[0][1].statusCode, 404);
      assert.equal(JSON.parse(lfc.args[0][1].body).test, 'test');
    });

    it('Should call fatal error handler when onSuccess process fail.', () => {
      const prepared = prepareLambdaFunction<null, string, null>({
        onSuccess: ((ambience, promise) => {
          promise.failure(new Error('This is error.'));
        })
      });

      const lf = prepared((ambience, promise) => {
        promise.success('This is a test.');
      });

      const lfc = sinon.spy();

      lf(null, null, lfc);

      assert.ok(lfc.calledOnce);
      assert.equal(lfc.args[0][1].statusCode, 500);
      assert.equal(JSON.parse(lfc.args[0][1].body).error, 'Fatal Error');
    });

    it('Should call fatal error handler when after process fail.', () => {
      const prepared = prepareLambdaFunction<null, string, null>({
        after: ((ambience, promise) => {
          promise.failure(new Error('This is error.'));
        })
      });

      const lf = prepared((ambience, promise) => {
        promise.success('This is a test.');
      });

      const lfc = sinon.spy();

      lf(null, null, lfc);

      assert.ok(lfc.calledOnce);
      assert.equal(lfc.args[0][1].statusCode, 500);
      assert.equal(JSON.parse(lfc.args[0][1].body).error, 'Fatal Error');
    });

    it('Should call fatal error handler when onFailure process fail.', () => {
      const prepared = prepareLambdaFunction<null, string, null>({
        onFailure: ((ambience, promise) => {
          promise.failure(new Error('This is error.'));
        })
      });

      const lf = prepared((ambience, promise) => {
        promise.failure(new Error('This is main error.'));
      });

      const lfc = sinon.spy();

      lf(null, null, lfc);

      assert.ok(lfc.calledOnce);
      assert.equal(lfc.args[0][1].statusCode, 500);
      assert.equal(JSON.parse(lfc.args[0][1].body).error, 'Fatal Error');
    });

  });

});