import { Icon, SemiconsProvider } from '@semicons/react';

function App() {
  return (
    <SemiconsProvider defaultMode="inline">
      <div className="app-container">
        <header>
          <h1>Semicons React Demo</h1>
          <p>展示使用 Lucide 图标的 Semicons 组件</p>
        </header>

        <main>
          <section>
            <h2>基本图标展示</h2>
            <div className="icons-grid">
              <div className="icon-item">
                <Icon name="lucide:home" size="lg" />
                <span className="icon-name">home</span>
              </div>
              <div className="icon-item">
                <Icon name="lucide:settings" size="lg" />
                <span className="icon-name">settings</span>
              </div>
              <div className="icon-item">
                <Icon name="lucide:user" size="lg" />
                <span className="icon-name">user</span>
              </div>
              <div className="icon-item">
                <Icon name="lucide:mail" size="lg" />
                <span className="icon-name">mail</span>
              </div>
              <div className="icon-item">
                <Icon name="lucide:bell" size="lg" />
                <span className="icon-name">bell</span>
              </div>
              <div className="icon-item">
                <Icon name="lucide:search" size="lg" />
                <span className="icon-name">search</span>
              </div>
              <div className="icon-item">
                <Icon name="lucide:calendar" size="lg" />
                <span className="icon-name">calendar</span>
              </div>
              <div className="icon-item">
                <Icon name="lucide:clock" size="lg" />
                <span className="icon-name">clock</span>
              </div>
            </div>
          </section>

          <section>
            <h2>不同尺寸的图标</h2>
            <div className="icons-grid">
              <div className="icon-item">
                <Icon name="lucide:star" size="xs" />
                <span className="icon-name">xs</span>
              </div>
              <div className="icon-item">
                <Icon name="lucide:star" size="sm" />
                <span className="icon-name">sm</span>
              </div>
              <div className="icon-item">
                <Icon name="lucide:star" size="md" />
                <span className="icon-name">md</span>
              </div>
              <div className="icon-item">
                <Icon name="lucide:star" size="lg" />
                <span className="icon-name">lg</span>
              </div>
              <div className="icon-item">
                <Icon name="lucide:star" size="xl" />
                <span className="icon-name">xl</span>
              </div>
            </div>
          </section>

          <section className="error-section">
            <h2>异常场景演示</h2>
            <p>以下是一些可能的错误使用场景：</p>
            <div className="icons-grid">
              <div className="icon-item">
                {/* 错误：不存在的图标名称 */}
                <Icon name="lucide:non-existent-icon" size="lg" />
                <span className="icon-name">不存在的图标</span>
              </div>
              <div className="icon-item">
                {/* 错误：使用非装饰性图标但没有 ariaLabel */}
                <Icon name="lucide:alert-circle" size="lg" decorative={false} ariaLabel="Alert" />
                <span className="icon-name">缺少 ariaLabel</span>
              </div>
              <div className="icon-item">
                {/* 错误：使用无效的尺寸值 */}
                <Icon name="lucide:error" size="lg" />
                <span className="icon-name">无效的尺寸</span>
              </div>
            </div>
          </section>

          <section>
            <h2>不同渲染模式</h2>
            <div className="icons-grid">
              <div className="icon-item">
                <Icon name="lucide:info" size="lg" mode="inline" />
                <span className="icon-name">inline 模式</span>
              </div>
              <div className="icon-item">
                <Icon name="lucide:warning" size="lg" mode="sprite" />
                <span className="icon-name">sprite 模式</span>
              </div>
              <div className="icon-item">
                <Icon name="lucide:success" size="lg" mode="auto" />
                <span className="icon-name">auto 模式</span>
              </div>
            </div>
          </section>
        </main>

        <footer>
          <p>© 2026 Semicons Demo</p>
        </footer>
      </div>
    </SemiconsProvider>
  );
}

export default App;
