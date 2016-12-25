import * as assert from 'power-assert';
import * as sinon from 'sinon';

import { prepareLambdaFunction, createLambdaFunction, lamprox, ILambdaCallback } from '../src';

describe('lamprox', () => {
  
  describe('prepareLambdaFunction()', () => {
    
    it('Should return prepared function.', () => {
      const prepared = prepareLambdaFunction<null, string>();
      
      const lf = prepared((ambience, promise) => {
        promise.success('This is a main process.');
      });

      const lfc = sinon.spy();

      lf(null, null, lfc);
      
      assert.ok(lfc.calledOnce);
      assert.equal(lfc.args[0][1].statusCode, 200);
      assert.equal(lfc.args[0][1].body, 'This is a main process.');
    });

    it('Should return prepared function with async process.', () => {
      const prepared = prepareLambdaFunction<null, string>();
      
      const lf = prepared((ambience, promise) => {
        setTimeout(() => {
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
      const prepared = prepareLambdaFunction<number, string>({
        before: ((ambience, promise) => {
          promise.success(10);
        })
      });
      
      const lf = prepared((ambience, promise) => {
        promise.success(`Before result is ${ambience.result}.`);
      });

      const lfc = sinon.spy();
      
      lf(null, null, lfc);

      assert.ok(lfc.calledOnce);
      assert.equal(lfc.args[0][1].body, 'Before result is 10.');
    });

    it('Should return prepared function when set onSucces process.', () => {
      const prepared = prepareLambdaFunction<null, { [key: string]: any }>({
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
      assert.equal(lfc.args[0][1].body, JSON.stringify({ test: 'This is a test.' }));
    });


    it('Should return prepared function when set after process.', () => {
      const prepared = prepareLambdaFunction<null, { [key: string]: any }>({
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
      assert.equal(lfc.args[0][1].body, JSON.stringify({ test: 'This is a test.', after: 42 }));
    });

    it('Should call default onFailure process when main process fail.', () => {
      const prepared = prepareLambdaFunction<null, string>();

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
      const prepared = prepareLambdaFunction<null, string>({
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
      const prepared = prepareLambdaFunction<null, string>({
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
      assert.equal(lfc.args[0][1].body, JSON.stringify({ test: 'test', message: 'This is error.' }));
    });

    it('Should call fatal error handler when onSuccess process fail.', () => {
      const prepared = prepareLambdaFunction<null, string>({
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
      assert.equal(lfc.args[0][1].body, JSON.stringify({
        error: 'Fatal Error',
        originalError: new Error('This is error')
      }));
    });

    it('Should call fatal error handler when after process fail.', () => {
      const prepared = prepareLambdaFunction<null, string>({
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
      assert.equal(lfc.args[0][1].body, JSON.stringify({
        error: 'Fatal Error',
        originalError: new Error('This is error')
      }));
    });

    it('Should call fatal error handler when onFailure process fail.', () => {
      const prepared = prepareLambdaFunction<null, string>({
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
      assert.equal(lfc.args[0][1].body, JSON.stringify({
        error: 'Fatal Error',
        originalError: new Error('This is error')
      }));
    });

  });

});