"use client";

import SectionBadge from "@/components/ui/section-badge";
import { StickyScroll } from "./sticky-scroll-reveal";
import { AnimatedComponent } from "@/lib/framer-animations";
import { motion } from "framer-motion";
import { sections } from "./AboutContent";
import { aboutSectionIcons } from "./AboutSectionIcons";
import { TextAnimate } from "@/components/magicui/text-animate";
import FramerMagnatic from "@/components/ui/framerMagnatic";

export function AboutSection() {
  return (
    <section id="about">
      <div className="py-16">
        <div className="mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col items-center mx-auto max-w-2xl lg:text-center">
            <AnimatedComponent animation="fadeIn" delay={0}>
              <SectionBadge className="bg-primary/20 mb-5 px-4">
                <span className="text-xs">About</span>
              </SectionBadge>
            </AnimatedComponent>

            <TextAnimate
              animation="blurIn"
              by="word"
              once
              delay={0.3}
              duration={1}
              as="h2"
              segmentClassName="inline-block"
              className="mt-2 font-bold text-zinc-900 dark:text-slate-100 text-3xl sm:text-5xl text-clip tracking-tight"
            >
              About this Project
            </TextAnimate>
            <AnimatedComponent animation="slideDown" delay={0.3}>
              <p className="mt-6 text-muted-foreground text-lg">
                A modern, no-nonsense approach to attendance tracking, built
                with code, fueled by caffeine, and slightly over-engineered
                (because why not?).
              </p>
            </AnimatedComponent>
          </div>
        </div>
      </div>
      <div className="relative">
        <AnimatedComponent animation="blurIn" delay={0.5}>
          <StickyScroll
            content={sections}
            contentClassName="space-x-4"
            renderItem={(item, isActive) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isActive ? 1 : 0.3, y: isActive ? 0 : 20 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {isActive && (
                  <>
                    {aboutSectionIcons[
                      item.id as keyof typeof aboutSectionIcons
                    ]?.map((icon, index) => (
                      <motion.div
                        key={index}
                        className={`absolute ${icon.position}`}
                        animate={{
                          y: [0, 5, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: index * 0.5,
                          ease: "easeInOut",
                        }}
                      >
                        <FramerMagnatic>
                          <icon.Icon
                            className={`opacity-20 w-12 md:w-16 h-12 md:h-16 text-${item.color}-500`}
                          />
                        </FramerMagnatic>
                      </motion.div>
                    )) || null}
                  </>
                )}
                <div className="z-10">
                  <div
                    className={`font-bold text-${item.color}-500 text-3xl mb-2`}
                  >
                    {item.title}
                  </div>
                  <p className="mt-4 max-w-lg text-muted-foreground text-xl">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            )}
          />
        </AnimatedComponent>
      </div>
    </section>
  );
}
