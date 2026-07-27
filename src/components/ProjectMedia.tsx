export function ProjectMedia({ image, hoverImage }: { image: string; hoverImage: string; effect?: number }) {
  const hasHover = Boolean(hoverImage && hoverImage !== image)

  return (
    <div className="project-media relative w-full overflow-hidden rounded-2xl bg-[#111] max-[760px]:rounded-xl">
      <img
        className={`block w-full object-cover transition-all duration-500 ease-out ${
          hasHover ? 'group-hover:opacity-0' : 'group-hover:scale-[1.03]'
        }`}
        src={`/assets/projects/${image}`}
        alt=""
        loading="lazy"
      />
      {hasHover && (
        <img
          className="absolute inset-0 block size-full object-cover opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-[1.03]"
          src={`/assets/projects/${hoverImage}`}
          alt=""
          loading="lazy"
        />
      )}
    </div>
  )
}
