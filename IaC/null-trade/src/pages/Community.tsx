import { CommunitySection, communityItems } from '../components/CommunityCard'

export function Community({ path: _path }: { path?: string }) {
  return (
    <div className="pt-13">
      <main className="w-281.5 max-w-full mx-auto border-x border-(--border) min-h-svh flex flex-col box-border">
        <section className="p-6 max-lg:p-4">
          <h1 className="font-bold text-(--text-h) text-2xl max-lg:text-xl">Comunidad</h1>
        </section>

        {communityItems.map((item, i) => (
          <div key={item.id}>
            <CommunitySection item={item} />
            {i < communityItems.length - 1 && (
              <div className="border-t border-(--border)" />
            )}
          </div>
        ))}
      </main>
    </div>
  )
}