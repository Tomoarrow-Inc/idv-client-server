import { MODULE_METADATA } from '@nestjs/common/constants';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { AppModule } from './app.module';

const repoRoot = resolve(__dirname, '..', '..');

describe('mock spec removal', () => {
  // Verifies the NestJS runtime surface no longer registers mock endpoints.
  it('does not register mock controllers or providers', () => {
    const controllers =
      Reflect.getMetadata(MODULE_METADATA.CONTROLLERS, AppModule) ?? [];
    const providers =
      Reflect.getMetadata(MODULE_METADATA.PROVIDERS, AppModule) ?? [];

    const controllerNames = controllers.map(
      (controller: Function) => controller.name,
    );
    const providerNames = providers.map((provider: unknown) =>
      typeof provider === 'function' ? provider.name : String(provider),
    );

    expect(controllerNames).not.toContain('MockController');
    expect(providerNames).not.toContain('MockService');
  });

  // Verifies generated mock spec output and hand-written mock endpoints are not restored.
  it('keeps TypeScript and Kotlin mock source trees removed', () => {
    const removedPaths = [
      'typescript/src/mock',
      'kotlin/src/mock',
      'kotlin/src/main/kotlin/com/tomoarrow/idv/bff/controller/MockController.kt',
      'kotlin/src/main/kotlin/com/tomoarrow/idv/bff/service/MockService.kt',
    ];

    for (const removedPath of removedPaths) {
      expect(existsSync(resolve(repoRoot, removedPath))).toBe(false);
    }
  });

  // Verifies the customer simulation board does not expose deprecated mock calls.
  it('does not expose mock endpoints on the test-board', () => {
    const testBoard = readFileSync(
      resolve(repoRoot, 'test-board/test-board.html'),
      'utf8',
    );

    expect(testBoard).not.toContain('/v1/idv/cn/mock');
    expect(testBoard).not.toMatch(/\bMock\b/);
  });
});
